import esbuild, { type BuildOptions, type BuildResult, type Metafile } from 'esbuild';

type JsOptions = BuildOptions & {
  target?: string | string[];
};

export async function buildJs(entry: string, options: JsOptions = {}): Promise<BuildResult> {
  return esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    ...options,
  });
}

export async function buildInlineJs(
  file: string,
  { minify = true, target }: { minify?: boolean; target?: string | string[] } = {}
): Promise<string> {
  const result = await esbuild.build({
    entryPoints: [file],
    bundle: true,
    minify,
    write: false,
    format: 'esm',
    target,
  });

  return result.outputFiles[0].text;
}

export function getOutputJsFile(metafile: Metafile): string {
  const file = Object.keys(metafile.outputs).find((f) => f.endsWith('.js'));

  if (!file) {
    throw new Error('No JS output found in metafile');
  }

  return file;
}
