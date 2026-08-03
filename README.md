# Sonora Desktop

La misma app de música, empaquetada como aplicación de escritorio (Electron) para
poder enviar el audio a dispositivos DLNA/UPnP de tu red local — altavoces
AudioCast, Smart TVs, etc. Esto **no es posible desde una página web** (los
navegadores no dan acceso a sockets UDP crudos ni a peticiones HTTP libres
contra dispositivos de la LAN); una app de escritorio sí puede.

## Qué hace y qué no

- **Sí puede:** descubrir dispositivos DLNA en tu red (búsqueda SSDP), conectarse
  a uno, y decirle "reproduce esta URL" (funciona con canciones cargadas desde
  tu R2 — para archivos locales, levanta automáticamente un mini-servidor en tu
  propio ordenador para que el dispositivo pueda pedírselo).
- **De momento no:** buscar posición dentro de la canción mientras se manda a un
  dispositivo DLNA (el progreso se simula con un reloj local, no viene del
  dispositivo real) ni control de volumen fino en todos los dispositivos (depende
  de si el fabricante implementa `RenderingControl` igual que el estándar).
- El botón de Chromecast (de la versión anterior) se mantiene tal cual, para si
  alguna vez usas un Chromecast de verdad — es un protocolo totalmente distinto.

## Estructura

```
sonora-desktop/
├── main.js              # proceso principal de Electron: ventana + IPC
├── preload.js            # puente seguro que expone window.audiocast al renderer
├── dlna/
│   ├── discover.js       # busqueda SSDP de dispositivos MediaRenderer
│   ├── control.js        # comandos SOAP/UPnP AVTransport (play/pause/stop/volumen)
│   └── localServer.js    # mini-servidor HTTP para servir archivos locales a la LAN
└── renderer/              # la app React (Vite) — el mismo reproductor de antes
```

## Puesta en marcha

```bash
cd sonora-desktop
npm install
npm run build:renderer   # compila la app React una vez
npm start                 # abre la aplicacion de escritorio
```

Cada vez que quieras actualizar la interfaz, repite `npm run build:renderer`
antes de `npm start`.

## Probado en este entorno

He podido instalar Electron de verdad, lanzar la aplicación completa con un
display virtual, y confirmar contra el proceso real:
- La ventana carga y renderiza la interfaz sin errores
- `window.audiocast` está disponible en el renderer (el puente de seguridad funciona)
- Pulsar "Enviar a AudioCast" dispara una búsqueda SSDP real por la red (UDP
  multicast) sin errores — 0 dispositivos encontrados porque este entorno no
  tiene una red local de verdad, que es justo lo esperable

Lo que **no** he podido probar es contra un dispositivo AudioCast físico (no
tengo uno). Si al conectar con el tuyo de verdad algo falla, pásame el mensaje
de error exacto — con eso puedo corregir el detalle concreto en vez de
adivinar.

## Generar un instalador de verdad (opcional)

Para tener un `.exe`/`.dmg`/`.AppImage` que puedas abrir con doble clic sin usar
la terminal:

```bash
npx electron-builder
```

Esto genera el instalador para tu sistema operativo actual dentro de la carpeta
`dist/`. Si quieres generar para otro sistema operativo distinto al que usas,
consulta la documentación de electron-builder — hace falta compilar en (o con
herramientas de) el sistema de destino.
