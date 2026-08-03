const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

let server = null;
let servedFile = null; // ruta absoluta del archivo que se esta sirviendo actualmente
let port = null;

function getLocalIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return '127.0.0.1';
}

const MIME = { '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.flac': 'audio/flac', '.aac': 'audio/aac' };

/**
 * Levanta (si no esta ya arriba) un servidor HTTP local que sirve UN unico
 * archivo de audio a la vez - el que se este reproduciendo. Los dispositivos
 * DLNA de la misma red pueden pedirselo por su IP local. Devuelve la URL
 * publica en la red local para ese archivo.
 */
function serveLocalFile(absolutePath) {
  return new Promise((resolve, reject) => {
    servedFile = absolutePath;
    if (server) {
      resolve(buildUrl());
      return;
    }
    server = http.createServer((req, res) => {
      if (!servedFile || !fs.existsSync(servedFile)) {
        res.writeHead(404);
        res.end();
        return;
      }
      const stat = fs.statSync(servedFile);
      const ext = path.extname(servedFile).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';

      // Soporte de rangos HTTP: los reproductores DLNA casi siempre piden
      // el audio por trozos (Range) para poder buscar/adelantar.
      const range = req.headers.range;
      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Content-Type': contentType,
        });
        fs.createReadStream(servedFile, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType, 'Accept-Ranges': 'bytes' });
        fs.createReadStream(servedFile).pipe(res);
      }
    });
    server.listen(0, '0.0.0.0', () => {
      port = server.address().port;
      resolve(buildUrl());
    });
    server.on('error', reject);
  });
}

function buildUrl() {
  const ext = path.extname(servedFile || '').toLowerCase() || '.mp3';
  return `http://${getLocalIp()}:${port}/track${ext}`;
}

function stopServer() {
  if (server) {
    server.close();
    server = null;
  }
}

module.exports = { serveLocalFile, stopServer };
