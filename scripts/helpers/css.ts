import { bundle, transform, type Targets } from 'lightningcss';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

type CssOptions = {
  minify?: boolean;
  targets?: Targets;
};

export async function buildCssBundle(file: string, { minify = true, targets }: CssOptions = {}): Promise<Uint8Array> {
  const { code } = bundle({
    filename: path.resolve(file),
    minify,
    targets,
  });

  return code;
}

export async function buildInlineCss(file: string, { minify = true, targets }: CssOptions = {}): Promise<string> {
  const input = await readFile(file);

  const { code } = transform({
    filename: file,
    code: input,
    minify,
    targets,
  });

  return code.toString();
}

export const hash = (content: string | Uint8Array): string =>
  crypto.createHash('sha1').update(content).digest('hex').slice(0, 8);
