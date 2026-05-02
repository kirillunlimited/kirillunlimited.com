export const SRC = 'src' as const;
export const DIST = 'dist' as const;

type Paths = {
  layout: string;
  pages: string;
  html: string;
  js: string;
  styles: string;
  lightCSS: string;
  darkCSS: string;
  initJS: string;
  static: string;
};

export const PATHS: Paths = {
  layout: `${SRC}/layouts/base.html`,
  pages: `${SRC}/pages`,
  html: `${SRC}/index.html`,
  js: `${SRC}/assets/js/main.js`,
  styles: `${SRC}/assets/css/styles.css`,
  lightCSS: `${SRC}/assets/css/themes/light.css`,
  darkCSS: `${SRC}/assets/css/themes/dark.css`,
  initJS: `${SRC}/assets/js/init.js`,
  static: `${SRC}/static`,
};

export type Meta = {
  url: string;
  locale: string;
};

export const META: Meta = {
  url: 'https://kirillunlimited.com',
  locale: 'en_US',
};

type Page = {
  input: string;
  output: `${string}.html`;
  title: string;
  description?: string;
  mainClass?: string;
  speedlify?: string;
};

export const PAGES: Page[] = [
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
