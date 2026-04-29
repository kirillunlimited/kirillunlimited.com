import vitePlugin from '@11ty/eleventy-plugin-vite';
import { outputDir, manifestPath } from './eleventy/constants.js';
import { visualizer } from 'rollup-plugin-visualizer';
import { markdown } from './eleventy/markdown.js';
import * as transforms from './eleventy/transforms.js';
import * as filters from './eleventy/filters.js';
import * as shortcodes from './eleventy/shortcodes.js';

const extract = (module, addHandler, config) => {
  Object.keys(module).forEach((name) => {
    config[addHandler](name, module[name]);
  });
};

export default async function (config) {
  config.addPlugin(vitePlugin, {
    viteOptions: {
      build: {
        rollupOptions: {
          plugins: [
            process.env.ANALYZE === 'true' &&
              visualizer({
                open: true,
                filename: 'dist/stats.html',
                gzipSize: true,
                brotliSize: true,
                template: 'treemap',
              }),
          ].filter(Boolean),
        },
      },
      server: {
        mode: 'development',
        middlewareMode: true,
      },
    },
  });

  config.setLibrary('md', markdown);

  extract(transforms, 'addTransform', config);
  extract(filters, 'addFilter', config);
  extract(shortcodes, 'addShortcode', config);

  config.addGlobalData('generated', () => Date.now());

  config.addPassthroughCopy({ 'src/static': './' });
  config.addPassthroughCopy('src/assets/js');
  config.addPassthroughCopy('src/assets/css');

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
