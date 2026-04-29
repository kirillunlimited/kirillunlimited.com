import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
let options = { html: true };

export const markdown = markdownIt(options).use(markdownItAttrs);
