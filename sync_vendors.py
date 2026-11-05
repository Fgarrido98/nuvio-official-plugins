#!/usr/bin/env python3
"""Actualiza las copias locales de los proveedores desde sus repos originales.

Uso:
    python3 sync_vendors.py

Si un repositorio original borra o mueve un archivo, este script falla para ese
proveedor pero deja intacta la copia local ya guardada en providers/.
"""
from __future__ import annotations

import hashlib
import json
import pathlib
import sys
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent
SOURCES = HERE / "sources.json"


def main() -> int:
    data = json.loads(SOURCES.read_text(encoding="utf-8"))
    updated = 0
    failed = 0
    for provider in data.get("providers", []):
        repo = provider.get("source")
        source_filename = provider.get("source_filename")
        target = provider.get("filename")
        if not repo or not source_filename or not target:
            continue
        url = f"https://raw.githubusercontent.com/{repo}/main/{source_filename}"
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=60) as response:
                body = response.read()
            if not body:
                raise ValueError("respuesta vacía")
        except Exception as error:
            print(f"FALLO {provider['id']}: {error}")
            failed += 1
            continue
        path = HERE / target
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        provider["sha256"] = hashlib.sha256(body).hexdigest()
        print(f"OK    {provider['id']:24} {len(body):>7} {provider['sha256'][:12]}")
        updated += 1
    SOURCES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"actualizados={updated} fallidos={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
