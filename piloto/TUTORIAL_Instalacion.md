# Tutorial de instalación — Entorno de prueba piloto

Objetivo: desde cero hasta tener **dos iconos en el escritorio** para **iniciar** y **detener** el sistema de Biblioteca Alejandría.

Tiempo estimado: 10–15 min.

---

## 0. Requisitos (instalar una sola vez)

1. **Git** — https://git-scm.com/download/win
2. **Node.js 18 o superior** (incluye `npm`) — https://nodejs.org/
3. **MySQL** en `localhost:3306`. Durante la instalación de MySQL tú elegiste una
   contraseña para `root`: **usa esa contraseña**, no hay una contraseña universal.
   (`123456` es solo el valor de ejemplo del equipo donde se preparó el piloto.)

Para comprobarlo, abre PowerShell y escribe:

```powershell
git --version
node --version
npm --version
```

Las tres deben responder con un número de versión.

---

## 1. Descargar el proyecto

Abre PowerShell y ejecuta (elige tu carpeta, por ejemplo `Documentos`):

```powershell
cd $env:USERPROFILE\Documents
git clone https://github.com/EdwinRVLK/Biblioteca_Alejandria-.git
cd Biblioteca_Alejandria
```

> Si la carpeta `Biblioteca_Alejandria` ya existe, entra en ella con `cd` y ejecuta `git pull`.

---

## 2. Instalar dependencias

Dentro de la carpeta del proyecto:

```powershell
npm install
```

Tarda 1–3 minutos. Verás una carpeta `node_modules` al terminar.

---

## 3. Configurar la base de datos (paso obligatorio)

No hace falta crear `.env` a mano: el script de inicio lo crea automáticamente en la
raíz del proyecto con estos **valores de ejemplo**:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456   <-- SOLO EJEMPLO: cambialo
DB_NAME=biblioteca
PORT=3001
```

> **Importante:** `DB_PASSWORD=123456` es la contraseña del equipo donde se preparó
> el piloto. **NO es universal.** Cada persona debe poner en `DB_PASSWORD` la
> contraseña que configuró en **su propio** MySQL durante la instalación.

Para hacerlo, abre el `.env` de la raíz del proyecto con:

```powershell
notepad .env
```

Cambia solo esta línea por tu contraseña real y guarda:

```
DB_PASSWORD=LA_CONTRASENA_QUE_CONFIGURASTE
```

Ejemplo: si al instalar MySQL elegiste `MiClave2026`, la línea queda `DB_PASSWORD=MiClave2026`.
Si además tu usuario no es `root`, cambia también `DB_USER`.

> `.env` está ignorado por Git: nunca se sube al repositorio porque contiene datos sensibles.

---

## 4. Crear los iconos en el escritorio

Entra a la carpeta `piloto` del proyecto:

```powershell
cd piloto
```

Y ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File .\Crear_Accesos_Directos.ps1
```

O, más fácil: **doble clic en `Crear_Accesos_Directos.bat`**.

Verás en el escritorio dos iconos nuevos con Logo de PowerShell:

| Icono | Qué hace |
|---|---|
| **Iniciar Piloto - Biblioteca** | Levanta MySQL, restaura la BD, carga los datos ficticios, inicia el servidor y abre el navegador. |
| **Detener Piloto - Biblioteca** | Apaga el servidor. |

Listo: ya tienes los archivos para correr y detener el sistema en el escritorio.

---

## 5. Probar que funciona

1. Doble clic en **Iniciar Piloto - Biblioteca**.
2. Espera a que aparezca:

   ```
   === LISTO PARA EL PILOTO ===
   Acceso:  http://localhost:3001/Biblioteca
   ```

   Se abrirá el navegador en esa dirección.

3. Entra con:

   ```
   Correo:      admin@alejandria.test
   Contraseña:  Admin2026
   ```

4. Cuando termines, doble clic en **Detener Piloto - Biblioteca**. La ventana debe mostrar `✓ Servidor detenido`.

> La ventana negra termina en `Presione una tecla para continuar...`: presiona cualquier tecla para cerrarla. Es normal.

---

## 6. Uso en la prueba de usabilidad

- Ejecuta **Iniciar Piloto** **antes de cada participante**. Restaura la BD al mismo estado inicial para que todos vean exactamente lo mismo.
- Los formatos para imprimir están en `piloto\formatos\`:
  - `Formatos_Piloto_Biblioteca_Alejandria.pdf`
  - `Formatos_Piloto_Biblioteca_Alejandria.docx`
- Imprime 4 hojas por participante y 1 hoja de bitácora para el equipo.

---

## Solución de problemas

### El acceso directo abre el Bloc de notas en vez de ejecutar

Significa que el acceso directo apunta al `.ps1` como documento. Bórralo y vuelve a ejecutar `Crear_Accesos_Directos.bat` (paso 4).

Si lo creas a mano, estos son los datos exactos:

| Campo | Valor |
|---|---|
| Destino | `C:\Windows\System32\cmd.exe` |
| Argumentos | `/c ""C:\...\Biblioteca_Alejandria\piloto\Iniciar_Piloto.bat""` |
| Iniciar en | `C:\...\Biblioteca_Alejandria\piloto` |

La ruta `C:\...` es la carpeta donde clonaste el proyecto. Repite lo mismo con `Detener_Piloto.bat`.

### El puerto 3001 está ocupado

Cierra el proceso que lo usa o ejecuta el inicio con otro puerto:

```powershell
powershell -ExecutionPolicy Bypass -File .\Iniciar_Piloto.ps1 -Puerto 3002
```

### Error al restaurar la base de datos

El script muestra ahora el mensaje real de MySQL. Casos comunes:

- `Access denied for user 'root'@'localhost'` → la contraseña del `.env` no coincide con la que configuraste en tu MySQL. Abre `notepad .env` en la raíz del proyecto y pon tu contraseña real en `DB_PASSWORD` (la `123456` que aparece es solo el ejemplo del equipo original).
- `Can't connect to MySQL server` → MySQL no está corriendo o no escucha en el puerto 3306.
- `Unknown database 'biblioteca'` → ya no debería aparecer: el dump crea la base de datos automáticamente.

Después de corregir, vuelve a hacer doble clic en **Iniciar Piloto - Biblioteca**.

### La contraseña no se escribe completa

Recarga la página con **Ctrl + F5**. El campo ya admite hasta 128 caracteres.

---

## Resumen de comandos

```powershell
git clone https://github.com/EdwinRVLK/Biblioteca_Alejandria-.git
cd Biblioteca_Alejandria
npm install
notepad .env      # cambia DB_PASSWORD por la contraseña que configuraste en TU MySQL
cd piloto
powershell -ExecutionPolicy Bypass -File .\Crear_Accesos_Directos.ps1
```

Después: doble clic en **Iniciar Piloto - Biblioteca** → http://localhost:3001/Biblioteca.
