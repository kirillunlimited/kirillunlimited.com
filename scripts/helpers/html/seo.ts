type SeoInput = {
  title: string;
  description: string;
  url: string;
  locale?: string;
};

const escapeHtml = (str = ''): string => str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeAttr = (str = ''): string => escapeHtml(str).replaceAll('"', '&quot;');

export const buildSeoTags = ({ title, description, url, locale = 'en_US' }: SeoInput): string => `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="keywords" content="Kirill Ivanov, frontend, developer, engineer, javascript" />

    <link rel="canonical" href="${escapeAttr(url)}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${escapeAttr(url)}">
    <meta property="og:locale" content="${escapeAttr(locale)}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
`;
