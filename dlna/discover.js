const { Client } = require('node-ssdp');
const http = require('http');
const https = require('https');

/**
 * Busca en la red local dispositivos UPnP/DLNA que puedan reproducir audio
 * (MediaRenderer) - esto es lo que hay dentro de un AudioCast, un altavoz DLNA,
 * una Smart TV con DLNA, etc. Devuelve una lista de { name, location, controlUrl }.
 */
function discoverDevices(timeoutMs = 4000) {
  return new Promise((resolve) => {
    const client = new Client();
    const found = new Map(); // location -> info basica (evita duplicados; varios anuncios llegan por dispositivo)

    client.on('response', (headers) => {
      const location = headers.LOCATION;
      if (location && !found.has(location)) {
        found.set(location, { location, usn: headers.USN });
      }
    });

    client.on('error', () => {
      // La busqueda simplemente no encontrara nada si falla el socket; no hace falta propagar el error al renderer.
    });

    client.search('urn:schemas-upnp-org:device:MediaRenderer:1');

    setTimeout(async () => {
      client.stop();
      const devices = [];
      for (const { location } of found.values()) {
        try {
          const details = await fetchDeviceDetails(location);
          if (details) devices.push(details);
        } catch (e) {
          // Si un dispositivo concreto no responde bien a la descripcion, lo ignoramos y seguimos con el resto.
        }
      }
      resolve(devices);
    }, timeoutMs);
  });
}

function fetchDeviceDetails(location) {
  return new Promise((resolve, reject) => {
    const lib = location.startsWith('https') ? https : http;
    lib
      .get(location, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            const name = (body.match(/<friendlyName>(.*?)<\/friendlyName>/) || [])[1] || 'Dispositivo sin nombre';
            // Buscamos el serviceType AVTransport y su controlURL correspondiente dentro del mismo bloque <service>.
            const serviceBlocks = body.match(/<service>[\s\S]*?<\/service>/g) || [];
            const avService = serviceBlocks.find((s) => /AVTransport/.test(s));
            if (!avService) return resolve(null);
            const controlPath = (avService.match(/<controlURL>(.*?)<\/controlURL>/) || [])[1];
            if (!controlPath) return resolve(null);
            const base = new URL(location);
            const controlUrl = new URL(controlPath, base).toString();
            resolve({ name, location, controlUrl });
          } catch (e) {
            resolve(null);
          }
        });
      })
      .on('error', reject);
  });
}

module.exports = { discoverDevices };
