/* eslint-disable @typescript-eslint/consistent-type-imports */

interface Exposed {
  readonly versions: Readonly<typeof import('./src/versions').versions>;
  readonly runSudo: Readonly<typeof import('./src/runSudo').versions>;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {}
