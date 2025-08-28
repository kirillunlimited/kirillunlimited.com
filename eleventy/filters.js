const { DateTime } = require('luxon');

const postDate = (dateObj) => DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');

module.exports = {
  postDate,
};
