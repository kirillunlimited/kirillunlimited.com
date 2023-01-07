const link = document.querySelector('[data-part1][data-part2][data-part3]');
const attrs = link.dataset;
link.setAttribute('href', `mailto:${attrs.part1}@${attrs.part2}.${attrs.part3}?from=${attrs.from}`);
