import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';
export type InstallationType = 'srisomanaath-cli' | 'shadcn-cli' | 'manual';

type Config = {
  packageManager: PackageManager;
  installationType: InstallationType;
};

const configAtom = atomWithStorage<Config>('srisomanaath.config', {
  packageManager: 'pnpm',
  installationType: 'srisomanaath-cli',
});

export function useConfig() {
  return useAtom(configAtom);
}
