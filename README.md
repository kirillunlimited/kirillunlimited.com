# kirillunlimited.com

## About

This is the source code for my personal website, which is available at [kirillunlimited.com](https://kirillunlimited.com).

It is a single static page with no JavaScript: one HTML file and one CSS file, which is inlined into the HTML and minified together with it.

## Structure

```
├── scripts/
│   ├── build.js      Build and dev server
│   └── images.js     Generates images in src/static from source/
├── source/            Original images (not published)
│   ├── hero.jpg
│   └── avatar.jpg
├── src/
│   ├── index.html     The page (SEO tags included)
│   ├── styles.css     All styles, inlined into the HTML on build
│   └── static/        Copied to dist as is: fonts, images, favicon, robots.txt, sitemap.xml, _headers
└── dist/              Build output (git-ignored)
```

## Installation

Prerequisites: Node 20+

1. Run `yarn install`

## Development

1. Run `yarn dev`
2. Open `http://localhost:3000/`

## Build

Run `yarn build`. It bundles and minifies `src/styles.css` (Lightning CSS), inlines it into `src/index.html`, minifies the HTML (minify-html) and copies `src/static` to `dist`.

## Images

Responsive hero images, icons and the favicon in `src/static` are generated from `source/` with `yarn images` (sharp). Run it after changing an original; the hero crops follow the focal point set at the top of `scripts/images.js` and `object-position` in `src/styles.css`.

## Formatting

Run `yarn format` (Prettier).

## Deployment

The project is hosted by [Cloudflare Pages](https://pages.cloudflare.com/). Build command: `yarn build`, output directory: `dist`.
