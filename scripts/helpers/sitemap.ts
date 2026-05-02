type SitemapInput = {
  baseUrl: string;
  lastmod: string;
};

export function generateSitemap({ baseUrl, lastmod }: SitemapInput): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>`;
}
