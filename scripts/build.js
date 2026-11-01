// Builds the site into ./dist: bundles and minifies the CSS, inlines it into index.html, minifies the HTML
// and copies src/static as is. With --serve it also serves ./dist on http://localhost:3000.
//
//   yarn build   one-off build
//   yarn dev     rebuilds on changes (node --watch) and serves the result
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { basename, extname, join } from 'node:path';
import browserslist from 'browserslist';
import { browserslistToTargets, transform } from 'lightningcss';
import minifyHtml from '@minify-html/node';

// First year of the copyright range in the footer
const START_YEAR = 2023;
const DIST = 'dist';

// Browser targets come from .browserslistrc; Lightning CSS uses them to add fallbacks and prefixes
const serve = process.argv.includes('--serve');
const targets = browserslistToTargets(browserslist());

// Footer copyright range: "2023–<current year>"
const year = new Date().getFullYear();
const years = year > START_YEAR ? `${START_YEAR}–${year}` : `${START_YEAR}`;

// Writes the finished site into `out`
async function render(out) {
  // CSS: minify and lower for the target browsers
  const { code } = transform({
    filename: 'src/styles.css',
    code: await readFile('src/styles.css'),
    minify: true,
    targets,
  });

  // HTML: inline the CSS and the year, then minify
  const html = (await readFile('src/index.html', 'utf-8'))
    .replace('/* CSS */', () => code.toString())
    .replace('<!-- YEARS -->', years);

  await writeFile(`${out}/index.html`, minifyHtml.minify(Buffer.from(html), {}));

  // Static files (fonts, images, favicon, robots.txt, sitemap.xml, _headers) are copied untouched
  await cp('src/static', out, { recursive: true, filter: (src) => basename(src) !== '.DS_Store' });
}

// Build into a private dir and swap it in at the end, so overlapping runs never touch each other's files
async function build() {
  const out = `${DIST}.tmp-${process.pid}`;
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  try {
    await render(out);
    // Another run may swap in between rm and rename, so retry a few times
    for (let attempt = 1; ; attempt++) {
      try {
        await rm(DIST, { recursive: true, force: true });
        await rename(out, DIST);
        break;
      } catch (e) {
        if (attempt === 5) throw e;
      }
    }
  } catch (e) {
    await rm(out, { recursive: true, force: true });
    throw e;
  }
}

// Build once on start. In dev a file can disappear mid-build (editors save via temp file + rename),
// so retry a few times instead of crashing
for (let attempt = 1; ; attempt++) {
  try {
    await build();
    console.log('✅ build done');
    break;
  } catch (e) {
    if (!serve) throw e;
    console.error(`❌ build failed (${e.message})`);
    if (attempt === 3) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

// Dev server: `node --watch` restarts this script on changes, which rebuilds and starts the server again.
// No live reload, refresh the page manually.
if (serve) {
  // Content types for the files in dist; anything else is served as a binary stream
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.avif': 'image/avif',
    '.woff2': 'font/woff2',
  };

  // Maps a URL to a file in dist; `/` serves index.html, anything missing is a 404
  createServer(async (req, res) => {
    const path = new URL(req.url, 'http://x').pathname;
    try {
      const file = await readFile(join(DIST, path.endsWith('/') ? `${path}index.html` : path));
      res.writeHead(200, {
        'Content-Type': types[extname(path)] || (path.endsWith('/') ? 'text/html' : 'application/octet-stream'),
      });
      res.end(file);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  }).listen(3000, () => console.log('http://localhost:3000'));
}
