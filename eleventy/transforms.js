const htmlMinifier = require('html-minifier');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html') && process.env.NODE_ENV === 'production';

const htmlmin = (content, outputPath) =>
  shouldTransformHTML(outputPath)
    ? htmlMinifier.minify(content, {
        html5: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      })
    : content;

module.exports = {
  htmlmin,
};
