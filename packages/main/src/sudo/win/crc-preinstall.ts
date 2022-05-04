
import * as winreg from 'winreg';
import * as pify from 'pify';
import * as os from 'node:os';

const MINIMUM_WIN_BUILD = 1709;
const MINIMUM_MEMORY = 9126;

export interface PreInstallCheck {
  passed: boolean;
  reason?: string;
}


export async function checkPreInstall(): Promise<PreInstallCheck> {
  const currentWinVersion = new winreg({hive: winreg.HKLM, key: 'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', });
  const currentBuildItem = await pify(currentWinVersion.get, {errorFirst: true})('CurrentBuild') as winreg.RegistryItem;
  const currentBuild = parseInt(currentBuildItem.value);

  if(currentBuild < MINIMUM_WIN_BUILD){
    return failureCheck('Red Hat OpenShift Local requires the Windows 10 Fall Creators Update (version 1709) or newer.');
  }


  if(getPhysicalMemory() < MINIMUM_MEMORY){
    return failureCheck('Red Hat OpenShift Local requires at least 9GB of RAM to run. Aborting installation.');
  }

  const currentEditionItem = await pify(currentWinVersion.get, {errorFirst: true})('EditionID') as winreg.RegistryItem;
  const winEdition = currentEditionItem.value;

  if(winEdition === 'Core') {
    return failureCheck('Red Hat OpenShift Local cannot run on Windows Home edition');
  }

  return {passed: true};
}

function failureCheck(reason: string): PreInstallCheck {
  return {passed: false, reason};
}

function getPhysicalMemory(): number {
  const totalRAM = os.totalmem();
  return totalRAM / (1024 * 1024);
}
