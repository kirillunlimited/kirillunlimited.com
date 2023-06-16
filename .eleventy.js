const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const constants = require('./utils/constants');
const markdown = require('./utils/markdown');
const transforms = require('./utils/transforms');
const filters = require('./utils/filters');
const shortcodes = require('./utils/shortcodes');
const collections = require('./utils/collections');

module.exports = function (config) {
  /* Plugins */
  config.addPlugin(pluginRss);
  config.addPlugin(syntaxHighlight);

  /* Markdown */
  config.setLibrary('md', markdown);

  /* Transforms */
  config.addTransform('htmlmin', transforms.htmlmin);

  /* Filters */
  config.addFilter('sortByOrder', filters.sortByOrder);
  config.addFilter('postDate', filters.postDate);
  config.addFilter('isoPostDate', filters.isoPostDate);
  config.addNunjucksFilter('isPageInCollection', filters.isPageInCollection);

  /* Shortcodes */
  config.addNunjucksAsyncShortcode('webpack', shortcodes.webpack);
  config.addNunjucksAsyncShortcode('image', shortcodes.imageShortcode);
  config.addNunjucksAsyncShortcode('logo', shortcodes.logoShortcode);
  config.addShortcode('picture', shortcodes.pictureShortcode);

  /* Collections */
  config.addCollection('postsByYear', collections.postsByYear);

  /* Static assets */
  config.addWatchTarget('./src/assets/img');
  config.addPassthroughCopy({ './src/static': './' });

  /* Reload the page every time any JS/CSS files are changed */
  config.setBrowserSyncConfig({ files: [constants.manifestPath] });

  return {
    dir: {
      input: 'src',
      output: constants.outputDir,
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
      markdownTemplateEngine: 'njk',
    },
  };
};
