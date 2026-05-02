import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import chokidar from 'chokidar';

import { PATHS, DIST, META, PAGES } from './helpers/constants.js';
import { inject, injectLiveReload, minifyHtml, createTemplateMap, renderPage } from './helpers/html.js';
import { buildJs, getOutputJsFile, buildInlineJs } from './helpers/js.js';
import { buildCssBundle, buildInlineCss, hash } from './helpers/css.js';
import { renderManifest } from './helpers/manifest.js';
import { generateSitemap } from './helpers/sitemap.js';
import { createDevServer } from './helpers/server.js';

// ---------------------
// MODE
// ---------------------
const isDev = process.argv.includes('--dev');

// ---------------------
// INIT
// ---------------------
await mkdir(DIST, { recursive: true });

// ---------------------
// BUILD
// ---------------------
async function build() {
  const ASSETS_DIR = `${DIST}/assets`;
  await mkdir(ASSETS_DIR, { recursive: true });

  // JS
  const jsResult = await buildJs(PATHS.js, {
    minify: !isDev,
    sourcemap: isDev,
    outdir: ASSETS_DIR,
    entryNames: isDev ? 'main' : '[name]-[hash]',
    metafile: !isDev,
  });
  const jsFile = isDev ? 'assets/main.js' : getOutputJsFile(jsResult.metafile).replace(`${ASSETS_DIR}/`, 'assets/');

  // CSS
  const cssCode = await buildCssBundle(PATHS.styles, { minify: !isDev });
  const cssFileName = isDev ? 'styles.css' : `styles-${hash(cssCode)}.css`;
  await writeFile(`${ASSETS_DIR}/${cssFileName}`, cssCode);
  const cssFile = `assets/${cssFileName}`;

  // INLINE
  const [lightCSS, darkCSS, initJS] = await Promise.all([
    buildInlineCss(PATHS.lightCSS, { minify: !isDev }),
    buildInlineCss(PATHS.darkCSS, { minify: !isDev }),
    buildInlineJs(PATHS.initJS, { minify: !isDev }),
  ]);

  // HTML
  for (const page of PAGES) {
    let html = await renderPage({
      layoutPath: PATHS.layout,
      pagePath: page.input,
    });

    html = inject(
      html,
      createTemplateMap({
        title: page.title,
        description: page.description,
        mainClass: page.mainClass,
        cssFile,
        jsFile,
        lightCSS,
        darkCSS,
        initJS,
        speedlify: page.speedlify,
      })
    );

    html = isDev ? injectLiveReload(html) : await minifyHtml(html);

    await writeFile(`${DIST}/${page.output}`, html);
  }

  // STATIC
  await cp(PATHS.static, DIST, { recursive: true });

  // MANIFEST
  const manifest = renderManifest({
    commit: process.env.CF_PAGES_COMMIT_SHA || 'dev',
  });

  await writeFile(`${DIST}/manifest.webmanifest`, JSON.stringify(manifest, null, 2));

  // SITEMAP (prod only)
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

  async function rebuild() {
    if (building) return;
    building = true;

    try {
      await build();
      server.reload();
      console.log('🔁 rebuilt');
    } catch (e) {
      console.error('❌ build error:', e);
    } finally {
      building = false;
    }
  }

  let timer;

  chokidar.watch('src', { ignoreInitial: true }).on('all', (event, file) => {
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
