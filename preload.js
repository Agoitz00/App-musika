const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('audiocast', {
  discover: () => ipcRenderer.invoke('audiocast:discover'),
  connect: (device) => ipcRenderer.invoke('audiocast:connect', device),
  disconnect: () => ipcRenderer.invoke('audiocast:disconnect'),
  play: (payload) => ipcRenderer.invoke('audiocast:play', payload),
  pause: () => ipcRenderer.invoke('audiocast:pause'),
  resume: () => ipcRenderer.invoke('audiocast:resume'),
  setVolume: (v) => ipcRenderer.invoke('audiocast:volume', v),
  // Da la ruta real en disco de un File elegido en un <input type="file">.
  // Solo funciona dentro de Electron (webUtils no existe en un navegador normal).
  getPathForFile: (file) => webUtils.getPathForFile(file),
});
