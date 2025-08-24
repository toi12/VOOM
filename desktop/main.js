
const { app, BrowserWindow } = require('electron');
const path = require('path');
function createWindow(){
  const win = new BrowserWindow({ width: 1200, height:800, webPreferences: { preload: path.join(__dirname, 'preload.js') }, icon: path.join(__dirname,'../assets/logo/logo.png') });
  win.loadURL(process.env.FRONT_URL || 'http://localhost:5174');
}
app.whenReady().then(createWindow);
app.on('window-all-closed', ()=>{ if (process.platform !== 'darwin') app.quit(); });
