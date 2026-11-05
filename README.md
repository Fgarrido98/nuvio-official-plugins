# Nuvio Xuper plugin

Plugin de Xuper para **Nuvio oficial 0.6.7-beta o superior**.

## Instalar

1. Abre Nuvio.
2. Ve a **Ajustes → Contenido y descubrimiento → Plugins**.
3. Pulsa **Añadir repositorio**.
4. Pega esta URL:

```text
https://raw.githubusercontent.com/Fgarrido98/nuvio-official-plugins/main/manifest.json
```

5. Activa el proveedor **Xuper** si aparece desactivado.
6. Abre una película o serie y espera unos segundos.

## Requisitos

- Nuvio oficial **0.6.7-beta** o superior. En 0.4.24 el runtime de plugins no soporta el shim de Xuper.
- El botón **Probar proveedor** prueba una película; para series hay que abrir una serie.

## Aviso

`xuper.js` incluye la clave interna del portal Xuper para poder cifrar las peticiones. Cualquiera que descargue el archivo puede extraerla.
