/**
 * PrimeSrc 4K/1080p — índice de servidores con archivos 2160p (UHD/DoVi) y 1080p, y
 * resolución Mixdrop.
 *
 * Flujo (verificado con Dune: Part Two, TMDB 693134):
 *   GET /api/v1/s?tmdb={id}&type=movie|tv[&season=&episode=]
 *     -> servers[].file_name incluye "2160p"/"1080p" y una key
 *   GET /api/v1/l?key={key}
 *     -> {"link":"https://mixdrop.ag/e/...","host":"mixdrop.ag"}   (Cloudflare)
 *   embed mixdrop -> packer -> MDCore.wurl -> https://{cdn}.mxcontent.net/v2/{id}.mp4
 *
 * El endpoint /l está protegido por Cloudflare. Este plugin funciona en runtimes que
 * resuelven el desafío (WebView/CloudflareKiller). Si el runtime no lo resuelve, el
 * fetch devuelve 403 y el servidor se omite. Voe/Dood necesitan ejecutar JavaScript y
 * también se omiten.
 */

var API = "https://primesrc.me/api/v1";
var MAX_SERVERS = 10;
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

function getJson(url, headers) {
  return fetch(url, {
    headers: Object.assign({ "Accept": "application/json", "User-Agent": UA }, headers || {})
  }).then(function (response) {
    if (!response.ok) {
      throw new Error("PrimeSrc respondió " + response.status);
    }
    return response.json();
  });
}

function qualityOf(server) {
  var name = String(server.file_name || "");
  var match = /(2160|1080|720|480|360)p/i.exec(name);
  if (match) return match[1] + "p";
  if (/\b(4k|uhd)\b/i.test(name)) return "2160p";
  return null;
}

function isPreferred(server) {
  var quality = qualityOf(server);
  return quality === "2160p" || quality === "1080p";
}

// 4K primero, luego 1080p; dentro de cada calidad se conserva el orden del proveedor.
function qualityRank(server) {
  return qualityOf(server) === "2160p" ? 0 : 1;
}

// ── Packer de Dean Edwards (mixdrop) ─────────────────────────────────
function decodePacked(html) {
  var marker = html.indexOf("function(p,a,c,k,e,d)");
  if (marker < 0) return null;
  var head = html.indexOf("}('", marker);
  if (head < 0) return null;
  var bodyStart = head + 3;
  var tail = /,(\d+),(\d+),'([\s\S]*)'\.split\('\|'\)/.exec(html.slice(bodyStart));
  if (!tail) return null;

  var output = html.slice(bodyStart, bodyStart + tail.index);
  var base = parseInt(tail[1], 10);
  var count = parseInt(tail[2], 10);
  var dictionary = tail[3].split("|");
  for (var i = count - 1; i >= 0; i--) {
    if (dictionary[i]) {
      output = output.replace(new RegExp("\\b" + i.toString(base) + "\\b", "g"), dictionary[i]);
    }
  }
  return output;
}

function resolveMixdrop(url) {
  return fetch(url, {
    headers: { "Referer": "https://mixdrop.top/", "User-Agent": UA }
  }).then(function (response) {
    if (!response.ok) return null;
    return response.text();
  }).then(function (html) {
    if (!html) return null;
    var decoded = decodePacked(html);
    if (!decoded) return null;

    var direct = /MDCore\.wurl\s*=\s*"([^"]*)"/.exec(decoded);
    var streamUrl = direct ? direct[1] : "";
    if (!streamUrl) {
      var server = /MDCore\.vserver\s*=\s*"([^"]+)"/.exec(decoded);
      var file = /MDCore\.vfile\s*=\s*"([^"]+\.mp4)"/.exec(decoded);
      if (server && file) {
        streamUrl = "https://" + server[1] + ".mxcontent.net/" + file[1];
      }
    }
    if (!streamUrl) return null;
    if (streamUrl.indexOf("//") === 0) streamUrl = "https:" + streamUrl;
    if (streamUrl.indexOf("http") !== 0) return null;

    return {
      url: streamUrl,
      type: "mp4",
      headers: { "Referer": "https://mixdrop.top/", "User-Agent": UA }
    };
  }).catch(function () {
    return null;
  });
}

function resolveEmbed(link) {
  if (/mixdrop\.(ag|co|top|to)\//i.test(link)) return resolveMixdrop(link);
  // Voe y Dood necesitan ejecutar JavaScript; se omiten en este plugin.
  return Promise.resolve(null);
}

function getStreams(tmdbId, mediaType, season, episode) {
  var type = mediaType === "tv" ? "tv" : "movie";
  var query = API + "/s?tmdb=" + encodeURIComponent(tmdbId) + "&type=" + type;
  if (type === "tv") {
    query += "&season=" + encodeURIComponent(season == null ? 1 : season) +
      "&episode=" + encodeURIComponent(episode == null ? 1 : episode);
  }

  return getJson(query).then(function (data) {
    var servers = (data.servers || [])
      .filter(isPreferred)
      .sort(function (a, b) { return qualityRank(a) - qualityRank(b); })
      .slice(0, MAX_SERVERS);
    var streams = [];
    var chain = Promise.resolve();

    servers.forEach(function (server) {
      chain = chain.then(function () {
        if (!server.key) return null;
        if (streams.length >= MAX_SERVERS) return null;
        return getJson(API + "/l?key=" + encodeURIComponent(server.key)).then(function (info) {
          if (!info || !info.link) return null;
          return resolveEmbed(info.link).then(function (resolved) {
            if (!resolved) return null;
            streams.push({
              name: "PrimeSrc 4K/1080p",
              title: qualityOf(server) + " · " + (info.host || server.name),
              url: resolved.url,
              quality: qualityOf(server),
              headers: resolved.headers
            });
            return null;
          });
        }).catch(function (error) {
          // Un servidor caído no debe tumbar los demás.
          console.log("[PrimeSrc] " + server.name + ": " + (error && error.message ? error.message : error));
          return null;
        });
      });
    });

    return chain.then(function () {
      console.log("[PrimeSrc] " + streams.length + " stream(s) 4K");
      return streams;
    });
  }).catch(function (error) {
    console.log("[PrimeSrc] error: " + (error && error.message ? error.message : error));
    return [];
  });
}

module.exports = { getStreams };
