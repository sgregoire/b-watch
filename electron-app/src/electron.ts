import {app, BrowserWindow, Menu, Tray, ipcMain, shell} from 'electron';
import {createServerFromArgs, parseArgs} from "bwatch-daemon";
import chalk from "chalk";
import * as path from "path";

const args = parseArgs({
    name: "bwatch",
    description: "bwatch desktop app",
    version: "0.0.1",
});

ipcMain.on("open-build", (event, args) => {
    const url = args[0];
    shell.openExternal(url);
});

function createWindow() {
    const icons = {
        'linux': 'iconTemplateWhite.png',
        'win32': 'windows-icon.png'
    }
    const iconName = icons[process.platform] || 'iconTemplate.png'
    const icon = path.join('assets', 'tray-icon', iconName)

    // Create the browser window.
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        title: "bwatch",
        icon,
    });

    ipcMain.once("app-ready", () => {

        console.log("app ready, starting server");
        const server = createServerFromArgs(args);
        switch (server.tag) {
            case "Ok": {
                server.value.start(() => {
                    console.log("server started, notifying app");
                    win.webContents.send("server-ready", true);
                });
                break;
            }
            case "Err": {
                console.log(chalk.red(server.err));
                app.exit(1);
                break;
            }
        }
    });

    ipcMain.on("renderer-ready", () => {
        win.webContents.send("get-args", args);
    });

    const dev = process.env.BW_ENV === "dev";

    win.removeMenu();
    if (dev) {
        win.webContents.openDevTools();
    }

    // and load the index.html of the app.
    // TODO file not at the same location when app is packaged
    const filePath = dev
        ? "index.html"
        : "build/index.html";
    win.loadFile(filePath);

    win.on('minimize', event => {
        event.preventDefault();
        win.hide();
    });

    win.on("close", () => {
        console.log("App closed");
    });

    app.dock && app.dock.hide();
    const tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show Builds'
                , click: () => {
                    win.show();
                }
            },
            {
                label: 'Quit'
                , click: () => {
                    app.quit();
                }
            }
        ]
    )
    tray.setToolTip('build-watcher')
    tray.setContextMenu(contextMenu)

}

app.on('ready', createWindow);





