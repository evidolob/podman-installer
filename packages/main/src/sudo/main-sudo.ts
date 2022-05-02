import { connectToMain } from "./ipc-sudo";


export async function runSudo(): Promise<void> {
  connectToMain();
}

runSudo();
