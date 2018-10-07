import { app, BrowserWindow, Tray, nativeImage } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

const isDevMode = process.execPath.match(/[\\/]electron/)

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' })

const createWindow = async () => {
  // Create the browser window.
  initializeMainWindow()

  // Tray Icon
  tray = new Tray(nativeImage.createFromPath("./src/images/tray.png"));
  tray.on("click", () => toggleGui());

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS)
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function initializeMainWindow () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 310,
    frame: false,
    show: true,
    fullScreenable: false,
    resizeable: false,
    transparent: true,
    "node-integration": false,
    backgroundThrottling: false
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('blur', () => mainWindow.hide())

  mainWindow.on('closed', () => mainWindow = null)
}

const toggleGui = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showGui();
  }
}

const showGui = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center gui horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height);

  return {
    x: x,
    y: y
  };
};

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})