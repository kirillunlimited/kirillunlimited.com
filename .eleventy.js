import { outputDir, manifestPath } from './eleventy/constants.js';
import { markdown } from './eleventy/markdown.js';
import * as transforms from './eleventy/transforms.js';
import * as filters from './eleventy/filters.js';
import * as shortcodes from './eleventy/shortcodes.js';
import { buildCSS } from './build/css.js';
import { buildJS } from './build/js.js';
import path from 'node:path';

const extract = (module, addHandler, config) => {
  Object.keys(module).forEach((name) => {
    config[addHandler](name, module[name]);
  });
};

export default async function (config) {
  config.setLibrary('md', markdown);

  extract(transforms, 'addTransform', config);
  extract(filters, 'addFilter', config);
  extract(shortcodes, 'addShortcode', config);

  config.addGlobalData('generated', () => Date.now());

  const cssEntries = {
    index: './src/assets/css/index.css',
  };

  const jsEntries = {
    app: './src/assets/js/app.js',
  };

  const cssSet = new Set(Object.values(cssEntries).map((p) => path.resolve(p)));
  const jsSet = new Set(Object.values(jsEntries).map((p) => path.resolve(p)));

  config.addTemplateFormats('css');

  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, filePath) => {
      const absPath = path.resolve(filePath);

      if (!cssSet.has(absPath)) return;

      return async () => {
        let { code } = await buildCSS(absPath);
        return code;
      };
    },
  });

  config.addFilter('css', async (filePath) => {
    let { code } = await buildCSS(path.resolve(filePath));
    return code;
  });

  config.addTemplateFormats('js');

  config.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, filePath) => {
      const absPath = path.resolve(filePath);

      if (!jsSet.has(absPath)) return;

      return async () => {
        return await buildJS(absPath);
      };
    },
  });

  config.addFilter('js', async (filePath) => {
    return await buildJS(path.resolve(filePath), { inline: true });
  });

  config.addFilter('asset', (filePath, type = null) => {
    const base = '/assets/';

    const path = type ? `${type}/${filePath}` : filePath;

    const version = process.env.CF_PAGES_COMMIT_SHA || 'dev';

    return `${base}${path}?v=${version}`;
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
