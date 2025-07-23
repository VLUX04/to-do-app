const { app, BrowserWindow } = require('electron');
app.commandLine.appendSwitch('lang', 'en-GB');
const path = require('path');
const { startBackendServer } = require('./backend');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  const dataPath = app.getPath('userData');
  startBackendServer(dataPath);
  createWindow();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});
