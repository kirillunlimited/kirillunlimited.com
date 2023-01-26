const { DateTime } = require('luxon');

module.exports = {
  sortByOrder: (elements) =>
    elements.filter((element) => element.data.permalink !== '/').sort((a, b) => a.data.order - b.data.order),

  postDate: (dateObj) => DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED),

  shortPostDate: (dateObj) => DateTime.fromJSDate(dateObj).toLocaleString({ month: 'short', day: 'numeric' }),

  isPageInCollection: (collection = [], pageUrl = this.ctx.page.url) =>
    collection.some((element) => element.url === pageUrl),
};
