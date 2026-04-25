const fs = require('fs');
const Image = require('@11ty/eleventy-img');
const constants = require('./constants');

module.exports = function (eleventyConfig) {
  const imagePath = async (src, format, widths = ['auto']) => {
    const imageMetadata = await Image(src, {
      formats: [format],
      outputDir: `${constants.outputDir}/assets/img`,
      urlPath: '/assets/img',
      widths,
    });

    const rawUrl = imageMetadata[format][0].url;

    return eleventyConfig.getFilter('url')(rawUrl);
  };

  const webpack = async (name) => {
    const manifest = await fs.promises
      .readFile(constants.manifestPath, 'utf8')
      .then(JSON.parse)
      .catch(() => null);

    const assetPath = manifest?.[name] || `/assets/${name}`;

    return eleventyConfig.getFilter('url')(assetPath);
  };

  return {
    imagePath,
    webpack,
  };
};
