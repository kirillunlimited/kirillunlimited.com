import { bundle, browserslistToTargets, Features } from 'lightningcss';
import packageJson from '../package.json' with { type: 'json' };
import path from 'node:path';

const isProd = process.env.NODE_ENV === 'production';

export async function buildCSS(path) {
  return await bundle({
    filename: path,
    minify: isProd,
    sourceMap: !isProd,
    targets: browserslistToTargets(packageJson.browserslist),
  });
}
