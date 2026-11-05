# Nuvio Plugins

Repositorio de plugins para **Nuvio oficial 0.6.7-beta o superior**.

## Instalar

1. Abre Nuvio.
2. Ve a **Ajustes → Contenido y descubrimiento → Plugins**.
3. Pulsa **Añadir repositorio**.
4. Pega esta URL:

```text
https://raw.githubusercontent.com/Fgarrido98/nuvio-official-plugins/refs/heads/main/manifest.json
```

5. Activa o desactiva los proveedores que quieras.
6. Abre una película o serie y espera unos segundos.

## Catálogo

Hay una lista de otros repos de plugins y addons latinos, con estado y notas, en [CATALOG.md](CATALOG.md).

## Contenido

- **Xuper** (`providers/xuper.js`): plugin propio, con filtro por título y año. Requiere Nuvio 0.6.7+.
- **35 proveedores latinos** incluidos en `providers/`.

El manifest descarga los `.js` desde **este repositorio**. Se guardó una copia local de cada archivo para que el repo siga funcionando si los originales los borran o cambian.

Para refrescar las copias:

```bash
python3 sync_vendors.py
python3 build.py
```

Proveedores incluidos:

`allpeliculasse`, `animeav1`, `areshd`, `brazucaplay`, `cinecalidad`, `cinemacity`, `cinemitas`, `cuevanaubd`, `detodopeliculas`, `doramasflix`, `elifilms`, `embed69`, `entrepeliculasyseries`, `fuegocine`, `hackstore`, `henaojara`, `lamovie`, `megadedeoficial`, `monoschinos`, `peliculasflix`, `pelis182`, `peliserieshoy`, `pelisgo`, `pelisplus`, `pelisplushdnz`, `playhubmax`, `seriesflix`, `seriesmetro`, `sololatino`, `tioplus`, `verpelis`, `videasy`, `vimeus`, `xupalace`, `zoowomaniacos`.

Se excluyeron `pelispanda` y `pelisyseries` porque en las pruebas fallaban con errores del propio proveedor (`setTimeout is not defined` y `fetch ... not a function`).

## Avisos

- `xuper.js` incluye la clave interna del portal Xuper para cifrar las peticiones. Cualquiera que descargue el archivo puede extraerla.
- Si un autor pide que se retire su proveedor, se elimina.
- Algunos proveedores pueden fallar o estar caídos; se pueden desactivar individualmente en Nuvio.
- Si actualizas el repositorio, refresca el repositorio en Nuvio para que baje los cambios.
