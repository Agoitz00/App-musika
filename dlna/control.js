const http = require('http');
const https = require('https');

function soapRequest(controlUrl, action, bodyXml) {
  return new Promise((resolve, reject) => {
    const url = new URL(controlUrl);
    const lib = url.protocol === 'https:' ? https : http;
    const envelope =
      '<?xml version="1.0" encoding="utf-8"?>' +
      '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
      `<s:Body>${bodyXml}</s:Body></s:Envelope>`;

    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset="utf-8"',
          'Content-Length': Buffer.byteLength(envelope),
          SOAPACTION: `"urn:schemas-upnp-org:service:AVTransport:1#${action}"`,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(body);
          else reject(new Error(`El dispositivo respondio ${res.statusCode} a ${action}`));
        });
      }
    );
    req.on('error', reject);
    req.write(envelope);
    req.end();
  });
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

async function setAndPlay(controlUrl, mediaUrl, title, artist) {
  const metadata = escapeXml(
    `<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/">` +
      `<item id="1" parentID="0" restricted="0">` +
      `<dc:title>${escapeXml(title || 'Cancion')}</dc:title>` +
      `<upnp:artist>${escapeXml(artist || '')}</upnp:artist>` +
      `<upnp:class>object.item.audioItem.musicTrack</upnp:class>` +
      `<res protocolInfo="http-get:*:audio/mpeg:*">${escapeXml(mediaUrl)}</res>` +
      `</item></DIDL-Lite>`
  );

  await soapRequest(
    controlUrl,
    'SetAVTransportURI',
    `<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">` +
      `<InstanceID>0</InstanceID><CurrentURI>${escapeXml(mediaUrl)}</CurrentURI>` +
      `<CurrentURIMetaData>${metadata}</CurrentURIMetaData></u:SetAVTransportURI>`
  );
  await play(controlUrl);
}

function play(controlUrl) {
  return soapRequest(controlUrl, 'Play', `<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>`);
}
function pause(controlUrl) {
  return soapRequest(controlUrl, 'Pause', `<u:Pause xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:Pause>`);
}
function stop(controlUrl) {
  return soapRequest(controlUrl, 'Stop', `<u:Stop xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:Stop>`);
}
function setVolume(controlUrl, volume0to100) {
  return soapRequest(
    controlUrl.replace('AVTransport', 'RenderingControl'),
    'SetVolume',
    `<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>${Math.round(volume0to100)}</DesiredVolume></u:SetVolume>`
  ).catch(() => {}); // el control de volumen via RenderingControl no siempre esta en la misma URL; si falla, no es critico
}

module.exports = { setAndPlay, play, pause, stop, setVolume };
