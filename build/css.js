import { bundle, browserslistToTargets, Features } from 'lightningcss';
import browserslist from 'browserslist';
import path from 'node:path';

const isProd = process.env.NODE_ENV === 'production';

export async function buildCSS(filePath) {
  return await bundle({
    filename: path.resolve(filePath),
    minify: isProd,
    sourceMap: !isProd,
    targets: browserslistToTargets(browserslist()),
  });
}
