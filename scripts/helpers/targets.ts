import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import type { Targets as LightningTargets } from 'lightningcss';

type Mode = 'development' | 'production';

type TargetsResult = {
  esbuild: string[];
  lightning: LightningTargets;
};

export function getTargets(mode: Mode): TargetsResult {
  const list: string[] = browserslist(null, { env: mode });

  return {
    esbuild: browserslistToEsbuild(list),
    lightning: browserslistToLightning(list),
  };
}

function browserslistToLightning(list: string[]): LightningTargets {
  const map: Record<string, number> = {};

  for (const item of list) {
    const [name, version] = item.split(' ');

    const v = parseInt(version);

    if (!Number.isNaN(v)) {
      map[name] = v;
    }
  }

  return map;
}
