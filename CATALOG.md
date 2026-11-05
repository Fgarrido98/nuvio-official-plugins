# Catálogo de plugins y addons latinos

Última verificación: **2026-11-05**.

Estados:

- ✅ manifest vivo y responde.
- ⚠️ manifest vivo, pero necesita configuración, token o debrid.
- ❌ caído o sin streams en la prueba.
- 🧪 no verificado.

## Plugins para Nuvio

Se instalan en **Ajustes → Contenido y descubrimiento → Plugins → Añadir repositorio**.

| Repo | Manifest | Proveedores | Idioma | Licencia | Último push | Estado |
|---|---|---:|---|---|---|---|
| **Nuvio Plugins (nuestro)** | [manifest](https://raw.githubusercontent.com/Fgarrido98/nuvio-official-plugins/refs/heads/main/manifest.json) | 36 | es | propia | 2026-11-05 | ✅ |
| KennethJYS/Nuvio-Providers-Latino | [manifest](https://raw.githubusercontent.com/KennethJYS/Nuvio-Providers-Latino/refs/heads/main/manifest.json) | 10 | es | sin licencia | 2026-10-08 | ✅ |
| latinokodi/latinuvio-V2 | [manifest](https://raw.githubusercontent.com/latinokodi/latinuvio-V2/main/manifest.json) | 24 | es | sin licencia | 2026-10-27 | ✅ |
| adrianjael/pluggin-latino | [manifest](https://raw.githubusercontent.com/adrianjael/pluggin-latino/refs/heads/main/manifest.json) | 17 | es | sin licencia | 2026-05-05 | ✅ |
| NuvioPlugin/All-in-One-Nuvio | [manifest](https://raw.githubusercontent.com/NuvioPlugin/All-in-One-Nuvio/refs/heads/main/manifest.json) | 66 | multi (incluye es) | GPL-3.0 según README | 2026-10-02 | ✅ |
| yoruix/nuvio-providers | [manifest](https://raw.githubusercontent.com/yoruix/nuvio-providers/main/manifest.json) | 29 | multi (incluye es) | GPL-3.0 | 2026-06-07 | ✅ |
| iberiaimm/nuvio-providers (Tapframe) | [manifest](https://raw.githubusercontent.com/iberiaimm/nuvio-providers/refs/heads/main/manifest.json) | 26 | multi (incluye es) | GPL-3.0 | 2026-04-14 | ✅ |
| hihihihihiiray/nuvio-plugins (Ray) | [manifest](https://raw.githubusercontent.com/hihihihihiiray/nuvio-plugins/refs/heads/main/manifest.json) | 18 | multi (incluye es) | GPL-3.0 | 2026-09-12 | ⚠️ ya no se mantiene |
| kaminarizz/Kamirama-Plugin | [manifest](https://raw.githubusercontent.com/kaminarizz/Kamirama-Plugin/main/manifest.json) | 24 | pt-BR | sin licencia | 2026-11-04 | ✅ otros idiomas |
| Gowaru/gowaru-nuvio-providers | [manifest](https://raw.githubusercontent.com/Gowaru/gowaru-nuvio-providers/refs/heads/main/manifest.json) | 37 | fr | GPL-3.0 | 2026-10-14 | ✅ otros idiomas |
| arakurumi/nuvio-anime-providers | [manifest](https://raw.githubusercontent.com/arakurumi/nuvio-anime-providers/main/manifest.json) | 7 | anime (en/id/ja/zh) | sin licencia | 2026-10-29 | ✅ otros idiomas |

Índice oficial de plugins: [NuvioCommunity/plugins](https://github.com/NuvioCommunity/plugins).

## Addons para Stremio / Nuvio

Los addons de Stremio se instalan desde **Addons → Install via URL** en Stremio, o desde la sección **Addons** de Nuvio. No son lo mismo que un plugin de scrapers de Nuvio.

| Addon | Instalación | Idioma | Estado | Notas |
|---|---|---|---|---|
| Addon Latam | [página](https://stremio-addons.net/addons/addon-latam) · [config](https://addonlatampagina.duckdns.org) | es-MX | ⚠️ registro | Manifest por usuario; el token público devuelve 403. Requiere crear cuenta. |
| LAT-ADD | [página](https://stremio-addons.net/addons/lat-add) | es | ⚠️ token | Muy popular (487 estrellas), pero el manifest público devuelve 401. Requiere enlace válido. |
| Progreso Latino | [manifest](https://progreso-latino.xyz/api/addon/manifest.json) | es | ⚠️ config | `configurationRequired: true`; sin configurar la ruta de stream no responde. |
| Peerflix | [manifest](https://peerflix.mov/manifest.json) | es/en | ✅ | Torrents con audio español/inglés; devolvió streams 4K para Matrix. Debrid opcional. |
| Linkañol | [manifest](https://8bcec99c5d97-spanish-links-addon.baby-beamup.club/manifest.json) | es-ES | ⚠️ config | Requiere AllDebrid/TorBox/Real-Debrid; sin configurar devuelve un proxy localhost. |
| Latinobrid | [manifest](https://latinobrid.stremx.net/manifest.json) | es-MX | ⚠️ debrid | Catálogo latino; requiere TorBox/debrid. Sin configurar devuelve 0 streams. |
| Subdivx | [manifest](https://subdivx.vercel.app/manifest.json) | es-MX | ❌ | El deployment de Vercel ya no existe. |
| RTVE | [manifest](https://rtve-stremio-addon.vercel.app/manifest.json) | es-ES | ❌ | Respondió 402 Payment Required en la prueba (Vercel). |
| Latino Movies | [manifest](https://latino-movies.vercel.app/manifest.json) | es | ❌ | Manifest vivo, pero `stream` devuelve vacío para Matrix. |

Índice de addons: [stremio-addons.net](https://stremio-addons.net/) · búsqueda latina: [stremio-addons.net/addons?search=latino](https://stremio-addons.net/addons?search=latino).

## Descartados

- `nvmindl/nuvio-providers`: manifest 404.
- `Subdivx`, `RTVE`, `Latino Movies`: manifiestos vivos pero sin reproducción en la prueba.
- `pelispanda` y `pelisyseries`: excluidos de nuestro repo por errores internos (`setTimeout is not defined`, `fetch ... not a function`).

## Notas

- Los repositorios sin licencia no dan permiso explícito de redistribución; el catálogo solo enlaza sus manifests.
- Los addons con `⚠️` necesitan configuración o cuenta; no se pueden instalar solo con el manifest público.
- Los estados pueden cambiar; este catálogo se actualiza a mano.
