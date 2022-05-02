import {app, dialog, ipcMain} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import * as sudo from 'sudo-prompt';
import { initIpc, startCheck } from './ipc-main';


/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));


/**
 * Install Vue.js or some other devtools in development mode only
 */
// if (import.meta.env.DEV) {
//   app.whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
//       loadExtensionOptions: {
//         allowFileAccess: true,
//       },
//     }))
//     .catch(e => console.error('Failed install extension:', e));
// }

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

ipcMain.on('run-sudo', async () => {
  try {
    initIpc().then(async (api) => {
      const res = await api.startCheck();
      dialog.showMessageBox({title: 'Sudo', message: `Current sudo user: ${res}`});
      api.exit();
    });

    let execPath = process.execPath;
    execPath +=  ' ' + __dirname + '/' + 'sudoMain.cjs';
    sudo.exec(execPath, {name: "podman installer", env: { ELECTRON_RUN_AS_NODE: "1"}}, (error, stdout, stderr) => {
      if(error) {
        console.error(error);
      }

      if(stderr) {
        console.error(stderr);
      }

      console.warn(stdout);
    });


  } catch(err) {
    console.error(err);
  }
});
