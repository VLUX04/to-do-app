const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadFile(frontendIndex);
}

app.whenReady().then(() => {
  const backend = spawn(process.execPath, [backendScript], {
    stdio: 'ignore',
    detached: true,
    windowsHide: true,
    shell: false
  });
  backend.unref();

  createWindow();

  app.on('window-all-closed', () => {
    backend.kill();
    app.quit();
  });
});
