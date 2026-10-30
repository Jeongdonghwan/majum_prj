import { SITE_URL, BRAND, CONTACT, BUSINESS, REVIEWS } from './site';

export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/images/designer.webp`,
  telephone: CONTACT.phone,
  founder: BUSINESS.ceo,
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '광주광역시', addressLocality: '서구', streetAddress: '송풍로7번길 16-6 지하 1층' },
  sameAs: [CONTACT.instagram, CONTACT.blog, CONTACT.place],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: REVIEWS.rating, reviewCount: REVIEWS.count },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: o.name,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀용 ItemList — path는 인코딩된 경로(pageEncodedPath)
export const itemListJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name })),
});
