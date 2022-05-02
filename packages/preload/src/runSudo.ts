import { ipcMain, ipcRenderer } from 'electron';
import {exposeInMainWorld} from './exposeInMainWorld';

exposeInMainWorld('runSudo', () => {
  ipcRenderer.send('run-sudo');
})
