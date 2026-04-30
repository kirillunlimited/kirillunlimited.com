import * as esbuild from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import packageJson from '../package.json' with { type: 'json' };
import path from 'node:path';

const isProd = process.env.NODE_ENV === 'production';

export async function buildJS(entry, { inline = false } = {}) {
  const result = await esbuild.build({
    entryPoints: [path.resolve(entry)],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    write: false,
    target: browserslistToEsbuild(packageJson.browserslist),
    format: inline ? 'iife' : 'esm',
  });

  return result.outputFiles[0].text;
}
