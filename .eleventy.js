const constants = require('./utils/constants');
const markdown = require('./utils/markdown');
const filters = require('./utils/filters');
const shortcodes = require('./utils/shortcodes');
const transforms = require('./utils/transforms');

module.exports = function (config) {
  /* Markdown */
  config.setLibrary('md', markdown);

  /* Transforms */
  config.addTransform('htmlmin', transforms.htmlmin);

  /* Filters */
  config.addFilter('sortByOrder', filters.sortByOrder);
  config.addFilter('postDate', filters.postDate);
  config.addNunjucksFilter('isPageInCollection', filters.isPageInCollection);

  /* Shortcodes */
  config.addNunjucksAsyncShortcode('webpack', shortcodes.webpack);
  config.addNunjucksAsyncShortcode('image', shortcodes.imageShortcode);
  config.addNunjucksAsyncShortcode('logo', shortcodes.logoShortcode);
  config.addShortcode('picture', shortcodes.pictureShortcode);

  /* Static assets */
  config.addPassthroughCopy('./src/favicon.ico');

  /* Reload the page every time any JS/CSS files are changed */
  config.setBrowserSyncConfig({ files: [constants.manifestPath] });

  return {
    dir: {
      input: 'src',
      output: constants.outputDir,
      includes: 'includes',
      layouts: 'layouts',
    },
  };
};
