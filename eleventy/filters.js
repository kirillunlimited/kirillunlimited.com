const { DateTime } = require('luxon');

const isoPostDate = (dateObj) => DateTime.fromJSDate(dateObj).toISO();

const isPageInCollection = (collection = [], pageUrl = this.ctx.page.url) =>
  collection.some((element) => element.url === pageUrl);

const postDate = (dateObj) => DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');

const postPicturePath = (name) => `src/assets/img/blog/${name}`;

const sortByOrder = (elements) => elements.sort((a, b) => a.data.order - b.data.order);

module.exports = {
  isoPostDate,
  isPageInCollection,
  postDate,
  postPicturePath,
  sortByOrder,
};
