const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html') && process.env.NODE_ENV === 'production';

module.exports = {
  htmlmin: (content, outputPath) =>
    shouldTransformHTML(outputPath)
      ? htmlmin.minify(content, {
          html5: true,
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        })
      : content,
};
