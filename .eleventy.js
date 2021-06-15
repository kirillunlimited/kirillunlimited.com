module.exports = function (config) {
  config.addPassthroughCopy('./src/css')
  config.addWatchTarget('./src/css')

  config.addPassthroughCopy('./src/img')
  config.addWatchTarget('./src/img')

  config.addPassthroughCopy('./src/fonts')
  config.addWatchTarget('./src/fonts')

  config.addPassthroughCopy('./src/js')
  config.addWatchTarget('./src/js')

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
