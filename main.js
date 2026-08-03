const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { discoverDevices } = require('./dlna/discover');
const dlnaControl = require('./dlna/control');
const localServer = require('./dlna/localServer');

let mainWindow;
let currentDevice = null; // { name, controlUrl }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0E0B14',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const rendererIndex = path.join(__dirname, 'renderer', 'dist', 'index.html');
  mainWindow.loadFile(rendererIndex);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  localServer.stopServer();
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ---- DLNA / audiocast IPC ----

ipcMain.handle('audiocast:discover', async () => {
  const devices = await discoverDevices();
  return devices.map((d) => ({ name: d.name, location: d.location, controlUrl: d.controlUrl }));
});

ipcMain.handle('audiocast:connect', async (event, device) => {
  currentDevice = device;
  return { ok: true };
});

ipcMain.handle('audiocast:disconnect', async () => {
  if (currentDevice) {
    try {
      await dlnaControl.stop(currentDevice.controlUrl);
    } catch (e) {
      /* si ya no responde, no pasa nada, igualmente lo olvidamos */
    }
  }
  currentDevice = null;
  localServer.stopServer();
  return { ok: true };
});

// filePath: null si la pista es una URL remota (nube); si es local, la ruta absoluta del archivo.
ipcMain.handle('audiocast:play', async (event, { remoteUrl, filePath, title, artist }) => {
  if (!currentDevice) throw new Error('No hay ningun dispositivo audiocast conectado.');
  let mediaUrl = remoteUrl;
  if (filePath) {
    mediaUrl = await localServer.serveLocalFile(filePath);
  }
  await dlnaControl.setAndPlay(currentDevice.controlUrl, mediaUrl, title, artist);
  return { ok: true, mediaUrl };
});

ipcMain.handle('audiocast:pause', async () => {
  if (!currentDevice) return { ok: false };
  await dlnaControl.pause(currentDevice.controlUrl);
  return { ok: true };
});

ipcMain.handle('audiocast:resume', async () => {
  if (!currentDevice) return { ok: false };
  await dlnaControl.play(currentDevice.controlUrl);
  return { ok: true };
});

ipcMain.handle('audiocast:volume', async (event, volume) => {
  if (!currentDevice) return { ok: false };
  await dlnaControl.setVolume(currentDevice.controlUrl, volume);
  return { ok: true };
});

// Da al renderer la ruta real de un File elegido por el usuario (Electron expone esto
// via webUtils en el propio renderer; este handler queda como respaldo/uso futuro).
ipcMain.handle('dialog:pickFolder', async () => {
  const res = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
  return res.canceled ? null : res.filePaths[0];
});
