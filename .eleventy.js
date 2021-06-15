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

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
