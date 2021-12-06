const fs = require('fs');
const path = require('path');

const isDev = process.env.APP_ENV === 'development';

const manifestPath = path.resolve(__dirname, 'dist', 'assets', 'manifest.json');
const manifest = isDev
  ? {
      'app.js': '/assets/app.js',
      'styles.css': '/assets/styles.css',
      'light.css': '/assets/light.css',
      'dark.css': '/assets/dark.css',
    }
  : JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));

module.exports = function (config) {
  /* Markdown */
  let markdownIt = require('markdown-it');
  let markdownItAttrs = require('markdown-it-attrs');
  let options = { html: true };
  config.setLibrary('md', markdownIt(options).use(markdownItAttrs));

  config.addNunjucksFilter('navLink', (link) => link.replace(/\index.html|.[^/.]+$/, '')); // Strip '.html' and 'index.html'

  config.addShortcode('bundledJs', function () {
    return manifest['app.js'] ? `<script src="${manifest['app.js']}"></script>` : '';
  });

  config.addShortcode('bundledCss', function () {
    return manifest['styles.css'] ? `<link href="${manifest['styles.css']}" rel="stylesheet" />` : '';
  });

  config.addShortcode('bundledLightScheme', function () {
    return manifest['light.css']
      ? `<link rel="stylesheet" href="${manifest['light.css']}" media="(prefers-color-scheme: light)" data-scheme-colors="light"/>`
      : '';
  });

  config.addShortcode('bundledDarkScheme', function () {
    return manifest['dark.css']
      ? `<link rel="stylesheet" href="${manifest['dark.css']}" media="(prefers-color-scheme: dark)" data-scheme-colors="dark"/>`
      : '';
  });

  /* Images */
  config.addPassthroughCopy('./src/img');
  config.addWatchTarget('./src/img');

  /* Fonts */
  config.addPassthroughCopy('./src/fonts');
  config.addWatchTarget('./src/fonts');

  config.addPassthroughCopy('./src/favicon.ico');

  // Reload the page every time any JS/CSS files are changed.
  config.setBrowserSyncConfig({ files: [manifestPath] });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
    },
  };
};
