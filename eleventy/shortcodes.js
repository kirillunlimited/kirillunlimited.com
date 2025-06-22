const fs = require('fs');
const Image = require('@11ty/eleventy-img');
const constants = require('./constants');

const imagePath = async (src, format, widths = ['auto']) => {
  const imageMetadata = await Image(src, {
    formats: [format],
    outputDir: `${constants.outputDir}/assets/img`,
    urlPath: '/assets/img',
    widths,
  });
  return imageMetadata[format][0].url;
};

const webpack = async (name) =>
  new Promise((resolve) => {
    fs.readFile(constants.manifestPath, { encoding: 'utf8' }, (err, data) =>
      resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
    );
  });

module.exports = {
  imagePath,
  webpack,
};
