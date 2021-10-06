function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function yearsDiff(fromDate, toDate) {
  let yearsDiff =  toDate.getFullYear() - fromDate.getFullYear();
  return yearsDiff;
}

function monthsDiff(fromDate, toDate) {
  let months = toDate.getMonth() - fromDate.getMonth()
  return months + 1; // include last month
}

module.exports = function (config) {
  /* Markdown */
  let markdownIt = require('markdown-it');
  let markdownItAttrs = require('markdown-it-attrs');
  let options = { html: true };
  config.setLibrary('md', markdownIt(options).use(markdownItAttrs));

  /* Styles */
  config.addPassthroughCopy('./src/css');
  config.addWatchTarget('./src/css');

  /* Scripts */
  config.addPassthroughCopy('./src/js');
  config.addWatchTarget('./src/js');

  /* Images */
  config.addPassthroughCopy('./src/img');
  config.addWatchTarget('./src/img');

  /* Fonts */
  config.addPassthroughCopy('./src/fonts');
  config.addWatchTarget('./src/fonts');

  config.addPassthroughCopy('./src/favicon.ico');

  config.addNunjucksFilter("dddate", function(value) {
    const date = new Date(value);

    if (isValidDate(date)) {
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${month} ${year}`;
    }
    return value;
  });

  config.addNunjucksFilter('duration', function(from, to) {
    const fromDate = new Date(from);
    const toDateTemp = new Date(to);
    const toDate = isValidDate(toDateTemp) ? toDateTemp : new Date();

    const years = yearsDiff(fromDate, toDate);
    const months = monthsDiff(fromDate, toDate);
    return `${years} лет и ${months} месяцев`;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist/tmp',
      includes: 'includes',
      layouts: 'layouts',
    },
  };
};
