import esbuild from 'esbuild';
import { readFile } from 'node:fs/promises';
import { SRC } from './constants.js';

export async function buildJs(entry, options = {}) {
  return esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    ...options,
  });
}

export async function buildInlineJs(file, { minify = true } = {}) {
  const result = await esbuild.build({
    entryPoints: [file],
    bundle: true,
    minify,
    write: false,
    format: 'esm',
  });

  return result.outputFiles[0].text;
}

export function getOutputJsFile(metafile) {
  return Object.keys(metafile.outputs).find((f) => f.endsWith('.js'));
}
