import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BRAND } from '../../../lib/site';
import { GROUPS, groupBySlug, groupEncodedPath, pageEncodedPath, pagePath } from '../../../lib/compose';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { JsonLd, Location } from '../../../components/Common';

export const dynamicParams = false;
export function generateStaticParams() {
  return [...GROUPS.keys()].map((g) => ({ g: g.replace(/ /g, '-') }));
}

const meta = (g: string) => ({
  title: `${g} 두피문신 안내 모음 | ${BRAND}`,
  description: `${g}에서 두피문신(SMP)·부위별 커버·교육을 알아보시는 분을 위한 안내 모음입니다. 시술은 광주 서구 풍암동 ${BRAND}에서 합니다.`,
});

export function generateMetadata({ params }: { params: { g: string } }): Metadata {
  const g = groupBySlug(params.g);
  if (!g) return {};
  const { title, description } = meta(g);
  const url = groupEncodedPath(g);
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, images: ['/images/hero.webp'] } };
}

export default function AreaPage({ params }: { params: { g: string } }) {
  const g = groupBySlug(params.g);
  if (!g) notFound();
  const ps = GROUPS.get(g)!;
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역별 안내', path: '/area/' }, { name: `${g} 안내`, path: groupEncodedPath(g) }]),
        itemListJsonLd(ps.slice(0, 30).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="sec">
        <div className="wrap">
          <h1 className="page-h1">{g} 두피문신 안내</h1>
          <p className="head-sub">{meta(g).description}</p>
          <div className="kw-links" data-reveal>
            <h2 className="kw-h">{g} 안내</h2>
            <ul>{ps.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
          </div>
          <p><Link href="/area/" className="link">다른 지역 보기</Link></p>
        </div>
      </section>
      <section className="sec tint"><div className="wrap"><Location /></div></section>
    </main>
  );
}
