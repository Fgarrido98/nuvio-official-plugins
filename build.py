#!/usr/bin/env python3
"""Genera el plugin Xuper para Nuvio oficial.

- Usa el bundle real `provider.js` de la app (assets/tv/provider.js).
- Incluye CryptoJS para 3DES-ECB y AES-128-ECB (el runtime de Nuvio no trae 3DES).
- Inyecta la `magisKey` desde local.properties en el JS generado.
- El manifest sigue el contrato viejo de Nuvio: sin apiVersion, hosts ni sha256.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
NUVIO = ROOT / "NuvioMobile"
PROVIDER = NUVIO / "androidApp/src/full/assets/tv/provider.js"
PROPERTIES = NUVIO / "local.properties"
CRYPTOJS = HERE / "vendor/crypto-js.js"
OUT_PLUGIN = HERE / "xuper.js"
OUT_MANIFEST = HERE / "manifest.json"

MANIFEST_VERSION = "2.0.0"
XUPER_VERSION = "1.0.1"


def property_value(name: str) -> str:
    if not PROPERTIES.is_file():
        raise SystemExit(f"falta {PROPERTIES}")
    for line in PROPERTIES.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith(f"{name}="):
            return stripped.split("=", 1)[1].strip()
    return ""


def main() -> int:
    if not PROVIDER.is_file():
        raise SystemExit(f"falta {PROVIDER}")
    if not CRYPTOJS.is_file():
        raise SystemExit(f"falta {CRYPTOJS}")
    magis_key = property_value("tvProvider.magisKey")
    if not magis_key:
        raise SystemExit("falta tvProvider.magisKey en local.properties")

    provider = PROVIDER.read_text(encoding="utf-8")
    crypto_js = CRYPTOJS.read_text(encoding="utf-8")

    template = r"""// Xuper para Nuvio oficial.
// Generado por build.py; no editar a mano.
// Requiere que Nuvio exponga TMDB_API_KEY y fetch en el runtime de plugins.
var __XUPER_MAGIS_KEY = __MAGIS_KEY__;

var CryptoJS = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  __CRYPTO_JS__
  return module.exports;
})();

var __xuperStorage = new Map();
function __xuperNow() { return Date.now(); }
function __xuperStorageSet(key, value, options) {
  var ttl = options && typeof options.ttlMs === "number" ? options.ttlMs : 0;
  __xuperStorage.set(String(key), {
    value: String(value),
    expiresAt: ttl > 0 ? __xuperNow() + ttl : 0
  });
}
function __xuperStorageGet(key) {
  var item = __xuperStorage.get(String(key));
  if (!item) return null;
  if (item.expiresAt && item.expiresAt <= __xuperNow()) {
    __xuperStorage.delete(String(key));
    return null;
  }
  return item.value;
}
function __xuperStorageRemove(key) { __xuperStorage.delete(String(key)); }
function __xuperStorageKeys() { return Array.from(__xuperStorage.keys()); }

function __xuperTmdbKey() {
  try {
    return typeof TMDB_API_KEY !== "undefined" && TMDB_API_KEY ? String(TMDB_API_KEY) : "";
  } catch (_) {
    return "";
  }
}

function __xuperFetch(url, options) {
  options = options || {};
  var headers = options.headers || {};
  var init = {
    method: String(options.method || "GET").toUpperCase(),
    headers: headers,
    redirect: options.followRedirects === false ? "manual" : "follow"
  };
  if (options.body !== undefined && options.body !== null) init.body = String(options.body);
  return fetch(String(url), init).then(function (response) {
    return response.text().then(function (body) {
      var contentType = response.headers && response.headers.get ? (response.headers.get("content-type") || "") : "";
      var contentEncoding = response.headers && response.headers.get ? (response.headers.get("content-encoding") || "") : "";
      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: {
          get: function (name) {
            if (!response.headers || !response.headers.get) return null;
            return response.headers.get(String(name));
          },
          "content-type": contentType,
          "content-encoding": contentEncoding
        },
        text: function () { return body; },
        json: function () { return JSON.parse(body); }
      };
    });
  });
}

var kino = {
  fetch: __xuperFetch,
  storage: {
    get: __xuperStorageGet,
    set: __xuperStorageSet,
    remove: __xuperStorageRemove,
    keys: __xuperStorageKeys
  },
  crypto: {
    hash: function (algorithm, text) {
      var name = String(algorithm || "sha256").toLowerCase();
      if (name === "md5") return CryptoJS.MD5(String(text)).toString();
      if (name === "sha256") return CryptoJS.SHA256(String(text)).toString();
      throw new Error("unsupported hash " + algorithm);
    },
    randomBytes: function (count) {
      return CryptoJS.lib.WordArray.random(Number(count) || 0).toString();
    },
    encrypt: function (algorithm, options) {
      options = options || {};
      if (algorithm === "des-ede3-ecb") {
        return CryptoJS.TripleDES.encrypt(
          CryptoJS.enc.Utf8.parse(String(options.data || "")),
          CryptoJS.enc.Hex.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString();
      }
      if (algorithm === "aes-128-ecb") {
        return CryptoJS.AES.encrypt(
          CryptoJS.enc.Hex.parse(String(options.data || "")),
          CryptoJS.enc.Utf8.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString();
      }
      throw new Error("unsupported encrypt " + algorithm);
    },
    decrypt: function (algorithm, options) {
      options = options || {};
      if (algorithm === "des-ede3-ecb") {
        return CryptoJS.TripleDES.decrypt(
          { ciphertext: CryptoJS.enc.Base64.parse(String(options.data || "")) },
          CryptoJS.enc.Hex.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString(CryptoJS.enc.Utf8);
      }
      if (algorithm === "aes-128-ecb") {
        return CryptoJS.AES.decrypt(
          { ciphertext: CryptoJS.enc.Base64.parse(String(options.data || "")) },
          CryptoJS.enc.Utf8.parse(String(options.key || "")),
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        ).toString(CryptoJS.enc.Utf8);
      }
      throw new Error("unsupported decrypt " + algorithm);
    }
  },
  config: {
    get: function (key) {
      if (key === "useSharedAccount" || key === "contribute") return false;
      if (key === "autoRefreshSeeds") return true;
      return undefined;
    }
  },
  error: function (code, message) {
    var error = new Error(message == null ? String(code) : String(message));
    error.name = "KinoError_" + String(code);
    error.code = String(code);
    return error;
  },
  log: function (line) { console.log(String(line == null ? "" : line)); },
  sleep: function (milliseconds) {
    return new Promise(function (resolve) { setTimeout(resolve, Number(milliseconds) || 0); });
  },
  lang: "es",
  appVersion: "49902",
  secret: function (name) {
    if (name === "magisKey") return __XUPER_MAGIS_KEY;
    if (name === "tmdbKey") return __xuperTmdbKey();
    throw new Error("unsupported secret " + name);
  },
  tmdb: function (path, params) {
    var key = __xuperTmdbKey();
    if (!key) return Promise.reject(new Error("TMDB key unavailable"));
    var query = Object.keys(params || {}).map(function (name) {
      return encodeURIComponent(name) + "=" + encodeURIComponent(String(params[name]));
    }).join("&");
    var url = "https://api.themoviedb.org/3" + path + "?api_key=" + encodeURIComponent(key) + (query ? "&" + query : "");
    return __xuperFetch(url, { timeoutMs: 8000 }).then(function (response) {
      if (!response.ok) throw new Error("TMDB " + response.status);
      return response.json();
    });
  },
  rank: {
    shortQuery: function (value) { return String(value); },
    filterRelevant: function (items) { return items; },
    sortBySimilarity: function (items) { return items; }
  },
  seed: function () { return false; }
};
globalThis.kino = kino;

__PROVIDER__

var __XUPER_STOPWORDS = {
  "el": true, "la": true, "los": true, "las": true, "un": true, "una": true,
  "unos": true, "unas": true, "de": true, "del": true, "y": true, "o": true,
  "the": true, "a": true, "an": true, "of": true, "and": true, "to": true,
  "in": true, "on": true, "for": true
};

function __xuperNormalize(value) {
  return String(value == null ? "" : value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function __xuperTokens(value) {
  return __xuperNormalize(value).split(" ").filter(function (token) {
    return token && !__XUPER_STOPWORDS[token];
  });
}

function __xuperSimilarity(left, right) {
  var a = __xuperTokens(left);
  var b = __xuperTokens(right);
  if (!a.length || !b.length) return 0;
  if (a.join(" ") === b.join(" ")) return 1;
  var seen = {};
  for (var i = 0; i < b.length; i++) seen[b[i]] = true;
  var overlap = 0;
  for (var j = 0; j < a.length; j++) if (seen[a[j]]) overlap++;
  var union = a.length + b.length - overlap;
  return union > 0 ? overlap / union : 0;
}

function __xuperYear(value) {
  var match = String(value == null ? "" : value).match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : 0;
}

async function __xuperTitle(tmdbId, mediaType) {
  var type = mediaType === "tv" ? "tv" : "movie";
  var id = String(tmdbId == null ? "" : tmdbId).trim();
  var result = { title: "", originalTitle: "", tmdbId: Number(id) || 0, type: type, year: 0 };
  try {
    if (/^tt\d+$/i.test(id)) {
      var found = await kino.tmdb("/find/" + encodeURIComponent(id), { external_source: "imdb_id", language: "es-MX" });
      var list = type === "tv" ? (found.tv_results || []) : (found.movie_results || []);
      if (!list.length) return result;
      id = String(list[0].id);
      result.tmdbId = Number(id) || 0;
    }
    var data = await kino.tmdb("/" + type + "/" + id, { language: "es-MX" });
    result.title = data.title || data.name || "";
    result.originalTitle = data.original_title || data.original_name || "";
    result.year = __xuperYear(data.release_date || data.first_air_date || "");
    return result;
  } catch (_) {
    return result;
  }
}

async function __xuperGetStreams(tmdbId, mediaType, season, episode) {
  var type = String(mediaType || "").toLowerCase();
  type = type === "tv" || type === "series" ? "tv" : "movie";
  var info = await __xuperTitle(tmdbId, type);
  if (!info.title) return [];
  var query = {
    q: info.title,
    originalTitle: info.originalTitle,
    tmdbId: info.tmdbId,
    type: type
  };
  if (type === "tv") {
    if (season != null) query.season = Number(season);
    if (episode != null) query.episode = Number(episode);
  }
  var found = await globalThis.__tv.search(query);
  var candidates = (Array.isArray(found) ? found : []).filter(function (item) {
    return item && !item.adult;
  }).map(function (item) {
    var score = Math.max(
      __xuperSimilarity(item.title, info.title),
      __xuperSimilarity(item.title, info.originalTitle)
    );
    var itemYear = __xuperYear(item.year);
    if (info.year && itemYear) {
      var yearDiff = Math.abs(info.year - itemYear);
      if (yearDiff === 0) score += 0.1;
      else if (yearDiff <= 1) score += 0.05;
      else if (yearDiff >= 2) score -= 0.2;
    }
    return { item: item, score: score };
  }).filter(function (entry) {
    return entry.score >= 0.7;
  }).sort(function (left, right) {
    return right.score - left.score;
  }).slice(0, 3).map(function (entry) {
    return entry.item;
  });
  if (candidates.length === 0) {
    console.log("xuper picks: sin coincidencias para " + info.title);
    return [];
  }
  console.log("xuper picks: " + candidates.map(function (item) { return item.title; }).join(" | "));
  var picks = candidates;
  var output = [];
  for (var i = 0; i < picks.length; i++) {
    try {
      var resolved = await globalThis.__tv.resolve(picks[i].ref);
      var copies = [resolved].concat(resolved && resolved.alternatives ? resolved.alternatives : []);
      for (var j = 0; j < copies.length; j++) {
        var copy = copies[j];
        if (!copy || !copy.url) continue;
        var label = [picks[i].title, copy.label].filter(Boolean).join(" \u00b7 ");
        output.push({
          title: label,
          name: label,
          url: copy.url,
          provider: "Xuper",
          headers: copy.headers || {}
        });
      }
    } catch (error) {
      console.log("xuper resolve: " + (error && error.message ? error.message : error));
    }
  }
  var seen = {};
  return output.filter(function (item) {
    var key = item.url.replace(/[?&]retry=\d+/, "");
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

module.exports = { getStreams: __xuperGetStreams };
"""

    generated = (
        template.replace("__MAGIS_KEY__", json.dumps(magis_key))
        .replace("__CRYPTO_JS__", crypto_js)
        .replace("__PROVIDER__", provider)
    )
    OUT_PLUGIN.write_text(generated, encoding="utf-8")
    scrapers = [
        {
            "id": "xuper",
            "name": "Xuper",
            "description": "Películas y series vía Xuper",
            "version": XUPER_VERSION,
            "filename": "xuper.js",
            "supportedTypes": ["movie", "tv"],
        }
    ]
    sources_path = HERE / "sources.json"
    if sources_path.is_file():
        data = json.loads(sources_path.read_text(encoding="utf-8"))
        for provider in data.get("providers", []):
            filename = str(provider.get("filename", "")).strip()
            if not filename:
                continue
            entry = {
                "id": provider["id"],
                "name": provider["name"],
                "version": provider.get("version", "1.0.0"),
                "filename": filename,
                "supportedTypes": provider.get("supportedTypes", ["movie", "tv"]),
            }
            description = provider.get("description")
            if description:
                entry["description"] = description
            if provider.get("hasSettings"):
                entry["hasSettings"] = True
            scrapers.append(entry)
    manifest = {
        "name": "Nuvio Plugins",
        "version": MANIFEST_VERSION,
        "description": "Xuper + proveedores latino para Nuvio oficial",
        "author": "fagx",
        "scrapers": scrapers,
    }
    OUT_MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"generado {OUT_PLUGIN} ({OUT_PLUGIN.stat().st_size} bytes)")
    print(f"generado {OUT_MANIFEST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
