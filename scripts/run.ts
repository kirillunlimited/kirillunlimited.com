import { writeFile, mkdir, cp } from 'node:fs/promises';
import chokidar from 'chokidar';

import { PATHS, DIST, META, PAGES } from './helpers/constants.js';
import { renderHTML } from './helpers/html';
import { buildJs, getOutputJsFile, buildInlineJs } from './helpers/js';
import { buildCssBundle, buildInlineCss, hash } from './helpers/css';
import { renderManifest } from './helpers/manifest';
import { generateSitemap } from './helpers/sitemap';
import { createDevServer } from './helpers/server';
import { getTargets } from './helpers/targets';

type Mode = 'development' | 'production';

const isDev: boolean = process.argv.includes('--dev');
const mode: Mode = isDev ? 'development' : 'production';

await mkdir(DIST, { recursive: true });

async function build(): Promise<void> {
  const ASSETS_DIR = `${DIST}/assets`;
  await mkdir(ASSETS_DIR, { recursive: true });

  const targets = getTargets(mode);

  // ---------------------
  // JS
  // ---------------------
  const jsResult = await buildJs(PATHS.js, {
    minify: !isDev,
    sourcemap: isDev,
    outdir: ASSETS_DIR,
    entryNames: isDev ? 'main' : '[name]-[hash]',
    metafile: !isDev,
    target: targets.esbuild,
  });

  const jsFile = isDev ? 'assets/main.js' : getOutputJsFile(jsResult.metafile!).replace(`${ASSETS_DIR}/`, 'assets/');

  // ---------------------
  // CSS
  // ---------------------
  const cssCode = await buildCssBundle(PATHS.styles, {
    minify: !isDev,
    targets: targets.lightning,
  });

  const cssFileName = isDev ? 'styles.css' : `styles-${hash(cssCode)}.css`;

  await writeFile(`${ASSETS_DIR}/${cssFileName}`, cssCode);

  const cssFile = `assets/${cssFileName}`;

  // ---------------------
  // INLINE
  // ---------------------
  const [initJS, lightCSS, darkCSS] = await Promise.all([
    buildInlineJs(PATHS.initJS, {
      minify: !isDev,
      target: targets.esbuild,
    }),
    buildInlineCss(PATHS.lightCSS, {
      minify: !isDev,
      targets: targets.lightning,
    }),
    buildInlineCss(PATHS.darkCSS, {
      minify: !isDev,
      targets: targets.lightning,
    }),
  ]);

  // ---------------------
  // HTML
  // ---------------------
  for (const page of PAGES) {
    let html = await renderHTML({
      isDev,
      layoutPath: PATHS.layout,
      pagePath: page.input,
      title: page.title,
      description: page.description,
      mainClass: page.mainClass,
      cssFile,
      jsFile,
      lightCSS,
      darkCSS,
      initJS,
      speedlify: page.speedlify,
    });

    await writeFile(`${DIST}/${page.output}`, html);
  }

  // ---------------------
  // STATIC
  // ---------------------
  await cp(PATHS.static, DIST, { recursive: true });

  // ---------------------
  // MANIFEST
  // ---------------------
  const manifest = renderManifest({
    commit: process.env.CF_PAGES_COMMIT_SHA || 'dev',
  });

  await writeFile(`${DIST}/manifest.webmanifest`, JSON.stringify(manifest, null, 2));

  // ---------------------
  // SITEMAP (prod only)
  // ---------------------
  if (!isDev) {
    const sitemap = generateSitemap({
      baseUrl: META.url,
      lastmod: new Date().toISOString(),
    });

    await writeFile(`${DIST}/sitemap.xml`, sitemap);
  }
}

// ---------------------
// DEV
// ---------------------
if (isDev) {
  const server = createDevServer({ dist: DIST });

  let building = false;

  async function rebuild(): Promise<void> {
    if (building) return;
    building = true;

    try {
      await build();
      server.reload();
      console.log('🔁 rebuilt');
    } catch (e: unknown) {
      console.error('❌ build error:', e);
    } finally {
      building = false;
    }
  }

  let timer: NodeJS.Timeout;

  chokidar.watch('src', { ignoreInitial: true }).on('all', (_event: string, file: string) => {
    if (!file.match(/\.(js|css|html)$/)) return;

    clearTimeout(timer);
    timer = setTimeout(rebuild, 50);
  });

  await build();
  server.listen(3000);
} else {
  await build();
  console.log('✅ build done');
}
