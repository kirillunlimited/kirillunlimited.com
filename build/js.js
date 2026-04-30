import * as esbuild from 'esbuild';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import packageJson from '../package.json' with { type: 'json' };

const isProd = process.env.NODE_ENV === 'production';

export async function buildJS(entry) {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd,
    write: false,
    target: browserslistToEsbuild(packageJson.browserslist),
  });

  return result.outputFiles[0].text;
}
