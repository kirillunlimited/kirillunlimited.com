module.exports = {
  postsByYear: (collectionApi) => {
    const dictByYear = collectionApi
      .getFilteredByTag('posts')
      .sort((a, b) => b.date - a.date)
      .reduce((dict, post) => {
        const year = post.date.getFullYear();
        if (!dict[year]) {
          dict[year] = [];
        }
        dict[year] = [...dict[year], post];
        return dict;
      }, {});
    return Object.entries(dictByYear);
  },
};
