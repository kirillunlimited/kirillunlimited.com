const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const constants = require('./eleventy/constants');
const markdown = require('./eleventy/markdown');
const transforms = require('./eleventy/transforms');
const filters = require('./eleventy/filters');
const shortcodes = require('./eleventy/shortcodes');

const extract = (module, addHandler, config) => {
  Object.keys(module).forEach((name) => {
    config[addHandler](name, module[name]);
  });
};

module.exports = function (config) {
  config.addPlugin(syntaxHighlight);

  config.setLibrary('md', markdown);

  extract(transforms, 'addTransform', config);
  extract(filters, 'addFilter', config);
  extract(shortcodes(config), 'addShortcode', config);

  config.addGlobalData('generated', () => new Date().getTime());

  config.addWatchTarget('./src/assets/img');
  config.addWatchTarget('./src/assets/css');
  config.addWatchTarget('./src/assets/js');

  config.addPassthroughCopy({ './src/static': './' });

  config.setBrowserSyncConfig({ files: [constants.manifestPath] });

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || '/',
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
