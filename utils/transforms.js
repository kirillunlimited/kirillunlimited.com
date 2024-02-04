const htmlmin = require('html-minifier');
const slugify = require('@sindresorhus/slugify');
const dom = require('linkedom');

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
  anchors: (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const window = dom.parseHTML(content);
      const domContent = window.document.querySelector('article');

      if (!domContent) {
        return content;
      };

      const headings = domContent.querySelectorAll('h2, h3, h4, h5, h6');

      for (const heading of headings) {
        const text = heading.textContent.trim()
        const id = slugify(text, {
          decamelize: false
        }).toLowerCase();

        heading.setAttribute('id', id);
      }

      return window.document.toString();
    }
    return content;
  }
};
