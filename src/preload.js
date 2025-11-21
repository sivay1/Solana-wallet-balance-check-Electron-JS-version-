import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  checkBalance: (wallet) => ipcRenderer.invoke("check-balance", wallet),
});
