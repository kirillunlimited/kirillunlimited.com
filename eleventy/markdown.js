let markdownIt = require('markdown-it');
let markdownItAttrs = require('markdown-it-attrs');
let options = { html: true };

module.exports = markdownIt(options).use(markdownItAttrs);
