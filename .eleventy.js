module.exports = function (config) {
  /* Markdown */
  let markdownIt = require('markdown-it');
  let markdownItAttrs = require('markdown-it-attrs');
  let options = { html: true };
  config.setLibrary('md', markdownIt(options).use(markdownItAttrs));

  config.addNunjucksFilter('navLink', (link) => link.replace(/\index.html|.[^/.]+$/, '')); // Strip '.html' and 'index.html'

  /* Styles */
  config.addPassthroughCopy('./src/css');
  config.addWatchTarget('./src/css');

  /* Scripts */
  config.addPassthroughCopy('./src/js');
  config.addWatchTarget('./src/js');

  /* Images */
  config.addPassthroughCopy('./src/img');
  config.addWatchTarget('./src/img');

  /* Fonts */
  config.addPassthroughCopy('./src/fonts');
  config.addWatchTarget('./src/fonts');

  config.addPassthroughCopy('./src/favicon.ico');

  return {
    dir: {
      input: 'src',
      output: 'dist/tmp',
      includes: 'includes',
      layouts: 'layouts',
    },
  };
};
