const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, 'dist/assets/manifest.json');

module.exports = function (config) {
  /* Markdown */
  let markdownIt = require('markdown-it');
  let markdownItAttrs = require('markdown-it-attrs');
  let options = { html: true };
  config.setLibrary('md', markdownIt(options).use(markdownItAttrs));

  config.addNunjucksFilter('navLink', (link) => link.replace(/\index.html|.[^/.]+$/, '')); // Strip '.html' and 'index.html'

  config.addNunjucksAsyncShortcode(
    'webpack',
    async (name) =>
      new Promise((resolve) => {
        fs.readFile(manifestPath, { encoding: 'utf8' }, (err, data) =>
          resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
        );
      })
  );

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
