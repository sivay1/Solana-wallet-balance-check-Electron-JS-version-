// const { app, BrowserWindow } = require('electron');

// const path = require('path');


// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   });

//   win.loadFile('index.html');
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { getTokenBalance } from "./logic.js";
import { customRateLimiter } from "./rateLimiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
  });

  win.loadFile("src/index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("check-balance", async (event, walletAddress) => {
  const result = customRateLimiter("local-user");

  if (!result.allowed) {
    return {
      error: `Too many requests. Try again in ${result.retryAfter.toFixed(1)} seconds`,
    };
  }

  return await getTokenBalance(walletAddress);
});


