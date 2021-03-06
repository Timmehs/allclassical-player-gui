import {
	app,
	BrowserWindow,
	Tray,
	nativeImage
} from "electron"
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from "electron-devtools-installer"
import {
	enableLiveReload
} from "electron-compile"

import path from "path"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

const isDevMode = process.env.NODE_ENV == "development"

if (isDevMode) enableLiveReload({
	strategy: "react-hmr"
})

const createWindow = async () => {
	// Create the browser window.
	initializeMainWindow()

	// Tray Icon
	tray = new Tray(path.resolve(__dirname, "images", "acp_tray_Template.png"))
	tray.on("click", () => toggleGui())

	// Open the DevTools.
	if (isDevMode) {
		await installExtension(REACT_DEVELOPER_TOOLS)
		mainWindow.webContents.openDevTools()
	}

	showGui()

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

function initializeMainWindow() {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 350,
		frame: false,
		show: false,
		fullScreenable: false,
		resizeable: false,
		transparent: true,
		"node-integration": false,
		backgroundThrottling: false,
		icon: path.join(__dirname, "images", "macos", "acp.icns")
	})

	mainWindow.loadURL(`file://${__dirname}/index.html`)

	// Hide on blur
	mainWindow.on("blur", () => !isDevMode && mainWindow.hide())

	mainWindow.on("closed", () => (mainWindow = null))
}

const toggleGui = () => {
	if (mainWindow.isVisible()) {
		mainWindow.hide()
	} else {
		showGui()
	}
}

const showGui = () => {
	const position = getWindowPosition()
	mainWindow.setPosition(position.x, position.y, false)
	mainWindow.show()
	mainWindow.focus()
}

const getWindowPosition = () => {
	const windowBounds = mainWindow.getBounds()
	const trayBounds = tray.getBounds()

	// Center gui horizontally below the tray icon
	const x = Math.round(trayBounds.x - windowBounds.width)

	// Position window 4 pixels vertically below the tray icon
	const y = Math.round(trayBounds.y + trayBounds.height)

	return {
		x: x,
		y: y
	}
}

app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})