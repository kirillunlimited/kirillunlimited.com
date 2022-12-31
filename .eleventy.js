const fs = require('fs');
const path = require('path');
const htmlmin = require('html-minifier');

const manifestPath = path.resolve(__dirname, 'dist/assets/manifest.json');

module.exports = function (config) {
  /* Markdown */
  let markdownIt = require('markdown-it');
  let markdownItAttrs = require('markdown-it-attrs');
  let options = { html: true };
  config.setLibrary('md', markdownIt(options).use(markdownItAttrs));

  /* Assets */
  config.addNunjucksAsyncShortcode(
    'webpack',
    async (name) =>
      new Promise((resolve) => {
        fs.readFile(manifestPath, { encoding: 'utf8' }, (err, data) =>
          resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
        );
      })
  );

  const shouldTransformHTML = (outputPath) =>
    outputPath && outputPath.endsWith('.html') && process.env.NODE_ENV === 'production';

  config.addTransform('htmlmin', (content, outputPath) =>
    shouldTransformHTML(outputPath)
      ? htmlmin.minify(content, {
          html5: true,
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        })
      : content
  );

  config.addPassthroughCopy('./src/assets/img');
  config.addWatchTarget('./src/assets/img');

  config.addPassthroughCopy('./src/favicon.ico');

  /* Reload the page every time any JS/CSS files are changed */
  config.setBrowserSyncConfig({ files: [manifestPath] });

  config.addFilter('stripTrailingSlash', (str) => {
    if (str === '/') {
      return str;
    }
    return str.replace(/\/+$/, '');
  });

  function sortByOrder(values) {
    return values.slice().sort((a, b) => a.data.order - b.data.order);
  }

  config.addFilter('sortByOrder', sortByOrder);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
    },
  };
};
