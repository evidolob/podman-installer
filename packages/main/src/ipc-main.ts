
import ipc from 'node-ipc';


export interface IpcApi {
  startCheck(): Promise<string>;
  exit(): void;
}
export async function initIpc(): Promise<IpcApi> {
  ipc.config.id   = 'podmanInstaller';
  ipc.config.retry= 1500;
  return new Promise((resolve, reject) => {
    ipc.serve(() => {

      ipc.server.on('init', (data, socket) => {
        resolve({
          startCheck: ()=> {
            return new Promise((resolve2) => {
              ipc.server.on('get-name-resp', (name) => {
                console.error(name)
                resolve2(name);
              });
              ipc.server.emit(socket, 'get-name');
            });
          },
          exit: () => {
            ipc.server.emit(socket, 'exit');
          }
        })

        ipc.server.on(
          'socket.disconnected',
          function(socket, destroyedSocketID) {
            ipc.log('client ' + destroyedSocketID + ' has disconnected!');
          }
        );
      });

      ipc.server.on('connect', () => {

      })
    })
    ipc.server.start();
  })
}
