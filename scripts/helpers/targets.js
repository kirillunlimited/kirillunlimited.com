import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';

export function getTargets(mode) {
  const list = browserslist(null, { env: mode });

  return {
    esbuild: browserslistToEsbuild(list),
    lightning: browserslistToLightning(list),
  };
}

function browserslistToLightning(list) {
  const map = {};

  for (const item of list) {
    const [name, version] = item.split(' ');

    const v = parseInt(version);

    if (!Number.isNaN(v)) {
      map[name] = v;
    }
  }

  return map;
}
