import { minify } from 'html-minifier-terser';
import { readFile } from 'node:fs/promises';

import { renderSpeedlify } from './speedlify';
import { buildSeoTags } from './seo';
import { META } from '../constants';
import { renderDate } from './date';

type TemplateMapInput = {
  title: string;
  description?: string;
  mainClass?: string;
  cssFile: string;
  jsFile: string;
  lightCSS: string;
  darkCSS: string;
  initJS: string;
  speedlify?: string;
};

type Replacements = Record<string, string>;

const createTemplateMap = (input: TemplateMapInput): Replacements => {
  return {
    '<!-- SEO -->': buildSeoTags({
      title: input.title,
      description: input.description || '',
      url: META.url,
      locale: META.locale,
    }),
    '<!-- MAIN_CLASS -->': input.mainClass || '',
    'styles.css': input.cssFile,
    'main.js': input.jsFile,
    '/* LIGHT_CSS */': input.lightCSS,
    '/* DARK_CSS */': input.darkCSS,
    '/* INIT_JS */': input.initJS,
    '<!-- SPEEDLIFY -->': input.speedlify ? renderSpeedlify(input.speedlify) : '',
    '<!-- LAST_UPDATE -->': renderDate(),
  };
};

export const inject = (html: string, replacements: Replacements): string => {
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(key, value);
  }
  return html;
};

export const injectLiveReload = (html: string): string =>
  html.replace(
    '</body>',
    `<script>
      const es = new EventSource('/reload');
      es.addEventListener('reload', () => location.reload());
    </script></body>`
  );

export const minifyHtml = async (html: string): Promise<string> =>
  minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    collapseBooleanAttributes: true,
    keepClosingSlash: true,
  });

export const renderPage = async ({
  layoutPath,
  pagePath,
}: {
  layoutPath: string;
  pagePath: string;
}): Promise<string> => {
  const [layout, page] = await Promise.all([readFile(layoutPath, 'utf-8'), readFile(pagePath, 'utf-8')]);

  return layout.replace('<!-- CONTENT -->', page);
};

export const renderHTML = async ({
  isDev,
  layoutPath,
  pagePath,
  title,
  description,
  mainClass,
  cssFile,
  jsFile,
  lightCSS,
  darkCSS,
  initJS,
  speedlify,
}: {
  isDev: boolean;
  layoutPath: string;
  pagePath: string;
} & TemplateMapInput): Promise<string> => {
  let html = await renderPage({
    layoutPath,
    pagePath,
  });

  html = inject(
    html,
    createTemplateMap({
      title,
      description,
      mainClass,
      cssFile,
      jsFile,
      lightCSS,
      darkCSS,
      initJS,
      speedlify,
    })
  );

  html = isDev ? injectLiveReload(html) : await minifyHtml(html);

  return html;
};
