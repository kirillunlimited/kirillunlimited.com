import { outputDir, manifestPath } from './eleventy/constants.js';
import { markdown } from './eleventy/markdown.js';
import * as transforms from './eleventy/transforms.js';
import * as filters from './eleventy/filters.js';
import * as shortcodes from './eleventy/shortcodes.js';
import { buildCSS } from './build/css.js';
import { buildJS } from './build/js.js';

const extract = (module, addHandler, config) => {
  Object.keys(module).forEach((name) => {
    config[addHandler](name, module[name]);
  });
};

const styles = ['./src/assets/css/index.css', './src/assets/css/themes/light.css', './src/assets/css/themes/dark.css'];
const scripts = ['./src/assets/js/init.js', './src/assets/js/app.js'];

export default async function (config) {
  config.setLibrary('md', markdown);

  extract(transforms, 'addTransform', config);
  extract(filters, 'addFilter', config);
  extract(shortcodes, 'addShortcode', config);

  config.addGlobalData('generated', () => Date.now());

  config.addTemplateFormats('css');

  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (!styles.includes(path)) return;

      return async () => {
        let { code } = await buildCSS(path);
        return code;
      };
    },
  });

  config.addFilter('css', async (path) => {
    let { code } = await buildCSS(path);
    return code;
  });

  config.addTemplateFormats('js');

  config.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, path) => {
      if (!scripts.includes(path)) return;

      return async () => {
        return await buildJS(path);
      };
    },
  });

  config.addFilter('js', async (path) => {
    let { code } = await buildJS(path);
    return code;
  });

  config.addPassthroughCopy({ 'src/static': '/' });

  config.addGlobalData('commit', () => process.env.CF_PAGES_COMMIT_SHA || 'dev');

  return {
    dir: {
      input: 'src',
      output: outputDir,
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    markdownTemplateEngine: 'njk',
  };
}
