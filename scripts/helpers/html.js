import { minify } from 'html-minifier-terser';
import { readFile } from 'node:fs/promises';

import { PAGES, META } from './constants.js';

function escapeHtml(str = '') {
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeAttr(str = '') {
  return escapeHtml(str).replaceAll('"', '&quot;');
}

function buildSeoTags({ title, description, url, locale = 'en_US' }) {
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="keywords" content="Kirill Ivanov, frontend, developer, engineer, javascript" />

    <link rel="canonical" href="${escapeAttr(url)}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${escapeAttr(url)}">
    <meta property="og:locale" content="${escapeAttr(locale)}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
`;
}

function getLastUpdateDate() {
  return process.env.CF_PAGES_COMMIT_TIMESTAMP || new Date().toISOString();
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function createTemplateMap({
  title,
  description,
  mainClass,
  cssFile,
  jsFile,
  lightCSS,
  darkCSS,
  initJS,
  speedlify,
}) {
  const iso = getLastUpdateDate();
  const formatted = formatDate(iso);
  return {
    '<!-- SEO -->': buildSeoTags({
      title,
      description,
      url: META.url,
      locale: META.locale,
    }),
    '<!-- MAIN_CLASS -->': mainClass || '',
    'styles.css': cssFile,
    'main.js': jsFile,
    '/* LIGHT_CSS */': lightCSS,
    '/* DARK_CSS */': darkCSS,
    '/* INIT_JS */': initJS,
    '<!-- SPEEDLIFY -->': speedlify ? renderSpeedlify(speedlify) : '',
    '<!-- LAST_UPDATE -->': `<time datetime="${iso}">${formatted}</time>`,
  };
}

export function inject(html, replacements) {
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(key, value);
  }
  return html;
}

export function injectLiveReload(html) {
  return html.replace(
    '</body>',
    `<script>
      const es = new EventSource('/reload');
      es.addEventListener('reload', () => location.reload());
    </script></body>`
  );
}

export async function minifyHtml(html) {
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,

    minifyCSS: true,
    minifyJS: true,

    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    collapseBooleanAttributes: true,

    keepClosingSlash: true,
  });
}

export async function renderPage({ layoutPath, pagePath }) {
  const [layout, page] = await Promise.all([readFile(layoutPath, 'utf-8'), readFile(pagePath, 'utf-8')]);

  return layout.replace('<!-- CONTENT -->', page);
}

function renderSpeedlify(hash) {
  const base = 'https://kirillunlimited-speedlify.netlify.app';

  return `
    <a
      href="${base}/kirillunlimited.com/#site-${hash}"
      target="_blank"
      rel="noopener noreferrer"
      class="footer__speedlify"
    >
      <speedlify-score
        speedlify-url="${base}"
        hash="${hash}"
      ></speedlify-score>
    </a>
  `;
}
