import { bundle, transform } from 'lightningcss';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export async function buildCssBundle(file, { minify = true, targets } = {}) {
  const { code } = bundle({
    filename: path.resolve(file),
    minify,
    targets,
  });

  return code;
}

export async function buildInlineCss(file, { minify = true, targets } = {}) {
  const input = await readFile(file);

  const { code } = transform({
    filename: file,
    code: input,
    minify,
    targets,
  });

  return code.toString();
}

export function hash(content) {
  return crypto.createHash('sha1').update(content).digest('hex').slice(0, 8);
}
