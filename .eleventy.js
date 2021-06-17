module.exports = function (config) {
  /* Styles */
  config.addWatchTarget('./src/css')
  /* Scripts */
  config.addWatchTarget('./src/js')
  /* Images */
  config.addPassthroughCopy('./src/img')
  config.addWatchTarget('./src/img')
  /* Fonts */
  config.addPassthroughCopy('./src/fonts')
  config.addWatchTarget('./src/fonts')

  config.addPassthroughCopy('./src/favicon.ico')

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
  }
}
