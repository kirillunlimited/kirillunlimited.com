export const SRC = 'src';
export const DIST = 'dist';
export const PATHS = {
  layout: 'src/layouts/base.html',
  pages: 'src/pages',
  html: `${SRC}/index.html`,
  js: `${SRC}/assets/js/main.js`,
  styles: `${SRC}/assets/css/styles.css`,
  lightCSS: `${SRC}/assets/css/themes/light.css`,
  darkCSS: `${SRC}/assets/css/themes/dark.css`,
  initJS: `${SRC}/assets/js/init.js`,
  static: `${SRC}/static`,
};

export const PAGES = [
  {
    input: `${PATHS.pages}/index.html`,
    output: 'index.html',
    title: 'Kirill Ivanov',
    description: 'Hello, my name is Kirill Ivanov. I am a software engineer.',
    speedlify: 'a62bad82',
  },
  {
    input: `${PATHS.pages}/404.html`,
    output: '404.html',
    mainClass: 'main--404',
    title: '404 – Page not found',
  },
];

export const META = {
  url: 'https://kirillunlimited.com',
  locale: 'en_US',
};
