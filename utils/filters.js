const { DateTime } = require('luxon');

module.exports = {
  sortByOrder: (elements) =>
    elements.sort((a, b) => a.data.order - b.data.order),

  postDate: (dateObj) => DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy'),

  isPageInCollection: (collection = [], pageUrl = this.ctx.page.url) =>
    collection.some((element) => element.url === pageUrl),

  isoPostDate: (dateObj) => DateTime.fromJSDate(dateObj).toISO(),

  postPicturePath: (name) => `src/assets/img/blog/${name}`
};
