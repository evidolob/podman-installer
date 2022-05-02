import ipc from 'node-ipc';
import * as cp from 'child_process';
import * as os from 'node:os';

export function connectToMain(): void {
  ipc.config.id = 'sudo-installer';
  ipc.config.retry = 1500;

  ipc.connectTo('podmanInstaller', () => {
    ipc.of.podmanInstaller.on('connect',
      () => {
        ipc.log('## connected to main ##');
        ipc.of.podmanInstaller.emit(
          'init',  //init event to initialize conversation
        )
      });

    ipc.of.podmanInstaller.on(
      'disconnect',
      () => {
        ipc.log('disconnected from world');
        console.log('Server disconnected, exiting...');
        process.exit(42);
      }
    );
    ipc.of.podmanInstaller.on(
      'exit',
      () => {
        console.log('Receive "exit" message, exiting...');
        ipc.disconnect('podmanInstaller');
        process.exit();
      }
    )


    ipc.of.podmanInstaller.on(
      'get-name',
      () => {
        try{
          let cmd = 'id -un'
          if(os.platform() === 'win32') {
            cmd = `fltmc >nul 2>&1 && (echo has admin permissions) || (echo has NOT admin permissions)`;
          }
          const res = cp.execSync(cmd);
          ipc.of.podmanInstaller.emit('get-name-resp', res.toString('utf8'));
        } catch(err) {
          ipc.log(err);
        }
      }
    )
  })
}
