const MONTHS = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь'
}

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

function pluralize(number, one, some, many) {
  if (number === 0) {
    return;
  }

  let noun;
  if (number === 1) {
    noun = one;
  } else if (number < 5) {
    noun = some;
  } else {
    noun = many;
  }
  return `${number} ${noun}`;
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

  config.addNunjucksFilter("monthAndYear", function(value) {
    const date = new Date(value);

    if (isValidDate(date)) {
      const month = MONTHS[date.getMonth()];
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
    const resultArray = [
      pluralize(years, 'год', 'года', 'лет'),
      pluralize(months, 'месяц', 'месяца', 'месяцев')
    ].filter(el => el);
    return resultArray.join(' и ');
  });

  config.addNunjucksFilter('navLink', (link) => link.replace('index.html',''));

  return {
    dir: {
      input: 'src',
      output: 'dist/tmp',
      includes: 'includes',
      layouts: 'layouts',
    },
  };
};
