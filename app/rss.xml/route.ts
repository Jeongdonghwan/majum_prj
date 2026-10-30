import { SITE_URL, BRAND } from '../../lib/site';
import { PAGES, compose, pageEncodedPath } from '../../lib/compose';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const now = new Date().toUTCString();
  const items = PAGES.slice(0, 50).map((p) => {
    const c = compose(p);
    const url = `${SITE_URL}${pageEncodedPath(p)}`;
    return `<item><title>${esc(c.title)}</title><link>${url}</link><description>${esc(c.description)}</description><pubDate>${now}</pubDate><guid isPermaLink="true">${url}</guid></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(BRAND)}</title><link>${SITE_URL}/</link><description>${esc(BRAND)} 두피문신 SMP 안내</description><language>ko</language><lastBuildDate>${now}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
