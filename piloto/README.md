# Entorno reproducible de la prueba piloto — Biblioteca Alejandría

Esta carpeta contiene **todo lo necesario para levantar y apagar exactamente el mismo entorno** usado en la prueba piloto de usabilidad.

## Contenido

| Archivo | Para qué sirve |
|---|---|
| `Iniciar_Piloto.bat` | **Doble clic**: levanta todo el entorno. |
| `Iniciar_Piloto.ps1` | Script real de arranque (MySQL → BD → datos → Node 3001 → navegador). |
| `Detener_Piloto.bat` | **Doble clic**: apaga el servidor del piloto. |
| `Detener_Piloto.ps1` | Script real de apagado. |
| `sembrar_piloto.js` | Carga los usuarios/libros/préstamos ficticios en la BD. |
| `generar_formatos_node.js` | Regenera los imprimibles (PDF y DOCX). |
| `formatos/` | Los 5 formatos imprimibles ya generados. |

## Requisitos previos (una sola vez)

1. Node.js 18+ y MySQL en `localhost:3306` con usuario `root` / contraseña `123456`
   (o ajusta esos valores en `.env`).
2. Instalar dependencias desde la raíz del repo:

   ```powershell
   cd D:\ruta\donde\clonaste\Biblioteca_Alejandria
   npm install
   ```

3. No hace falta crear `.env`: `Iniciar_Piloto.ps1` lo genera automáticamente con los
   valores del piloto si no existe. `.env` está ignorado por Git (**no se sube**, contiene secretos).

## Uso diario

**Levantar** — doble clic en `Iniciar_Piloto.bat`, o:

```powershell
powershell -ExecutionPolicy Bypass -File .\piloto\Iniciar_Piloto.ps1
```

**Apagar** — doble clic en `Detener_Piloto.bat`, o:

```powershell
powershell -ExecutionPolicy Bypass -File .\piloto\Detener_Piloto.ps1
```

Resultado esperado al iniciar:

```
✓ MySQL activo
✓ Base de datos restaurada
=== DATOS FICTICIOS LISTOS ===
✓ Servidor iniciado
✓ Health check OK: http://localhost:3001/api/status
=== LISTO PARA EL PILOTO ===
```

> **Importante:** ejecuta `Iniciar_Piloto` **antes de cada participante**. Restaura la BD al mismo estado inicial para que todos vean lo mismo.

## Acceso y datos de prueba

- URL: **http://localhost:3001/Biblioteca**
- Bibliotecario: `admin@alejandria.test` / `Admin2026`

| Tarea | Datos |
|---|---|
| T01 · Registrar préstamo | Usuario **Ana Piloto** (`ana.piloto@alejandria.test`, id 24); libros **Cosmos** (id 1) y **Sapiens** (id 37); devolución **2026-12-02** |
| T02 · Consultar disponibilidad | **Así habló Zaratustra** (id 25) y **La interpretación de los sueños** (id 2) |
| T03 · Registrar devolución | **Luis Piloto** (id 25), préstamo **30**; libros **Código limpio** (id 28) e **Introducción a los algoritmos** (id 29) |

## Impresión

En `formatos/`:

- `Formatos_Piloto_Biblioteca_Alejandria.pdf` (5 páginas)
- `Formatos_Piloto_Biblioteca_Alejandria.docx`

Imprimir **4 hojas por participante** (consentimiento, guion, registro, SUS) y **1 hoja de bitácora** para el equipo.

Para regenerarlos:

```powershell
node .\piloto\generar_formatos_node.js
```

## Notas

- Se usa el puerto **3001** porque el 3000 suele estar ocupado por Docker. Las llamadas a la API son relativas (`/api/...`), así que funciona en cualquier puerto. Puedes cambiarlo con `-Puerto 3002`.
- Los archivos `servidor.pid` y `servidor.*.log` se generan al iniciar y están ignorados por Git.
- El dump `MySQL/biblioteca_actualizada.sql` está incluido en el repo y se restaura en cada arranque.
