# Nuvio Plugins

Repositorio de plugins para **Nuvio oficial 0.6.7-beta o superior**.

## Instalar

1. Abre Nuvio.
2. Ve a **Ajustes → Contenido y descubrimiento → Plugins**.
3. Pulsa **Añadir repositorio**.
4. Pega esta URL:

```text
https://raw.githubusercontent.com/Fgarrido98/nuvio-official-plugins/main/manifest.json
```

5. Activa o desactiva los proveedores que quieras.
6. Abre una película o serie y espera unos segundos.

## Contenido

- **Xuper** (`xuper.js`): plugin propio, con filtro por título y año. Requiere Nuvio 0.6.7+.
- **35 proveedores latinos** de tres repositorios públicos:
  - [KennethJYS/Nuvio-Providers-Latino](https://github.com/KennethJYS/Nuvio-Providers-Latino)
  - [latinokodi/latinuvio-V2](https://github.com/latinokodi/latinuvio-V2)
  - [adrianjael/pluggin-latino](https://github.com/adrianjael/pluggin-latino)

El manifest apunta directamente a los archivos `.js` originales de esos repositorios. **No se copia ni se redistribuye su código**: Nuvio lo descarga desde el repositorio de origen. Todo el crédito es para sus autores.

Proveedores incluidos:

`allpeliculasse`, `animeav1`, `areshd`, `brazucaplay`, `cinecalidad`, `cinemacity`, `cinemitas`, `cuevanaubd`, `detodopeliculas`, `doramasflix`, `elifilms`, `embed69`, `entrepeliculasyseries`, `fuegocine`, `hackstore`, `henaojara`, `lamovie`, `megadedeoficial`, `monoschinos`, `peliculasflix`, `pelis182`, `peliserieshoy`, `pelisgo`, `pelisplus`, `pelisplushdnz`, `playhubmax`, `seriesflix`, `seriesmetro`, `sololatino`, `tioplus`, `verpelis`, `videasy`, `vimeus`, `xupalace`, `zoowomaniacos`.

Se excluyeron `pelispanda` y `pelisyseries` porque en las pruebas fallaban con errores del propio proveedor (`setTimeout is not defined` y `fetch ... not a function`).

## Avisos

- `xuper.js` incluye la clave interna del portal Xuper para cifrar las peticiones. Cualquiera que descargue el archivo puede extraerla.
- Los repositorios de origen no declaran licencia. Si eres autor y quieres que se retire un proveedor, abre un issue en este repositorio.
- Algunos proveedores pueden fallar o estar caídos; se pueden desactivar individualmente en Nuvio.
- Si actualizas el repositorio, refresca el repositorio en Nuvio para que baje los cambios.
