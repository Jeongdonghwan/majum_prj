import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND } from '../../lib/site';
import { GROUPS, groupEncodedPath, groupPath } from '../../lib/compose';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Head, JsonLd, Location } from '../../components/Common';

const title = `광주·전남·전북 지역별 두피문신 안내 | ${BRAND}`;
const description = `광주 서구 풍암동 ${BRAND}에서 광주·전남·전북 시·구별 두피문신(SMP) 안내를 지역별로 모았습니다.`;
export const metadata: Metadata = { title, description, alternates: { canonical: '/area/' }, openGraph: { title, description, url: '/area/', images: ['/images/hero.webp'] } };

export default function AreaIndex() {
  const groups = [...GROUPS.entries()];
  return (
    <main>
      <JsonLd data={[breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역별 안내', path: '/area/' }]), itemListJsonLd(groups.map(([g]) => ({ name: `${g} 두피문신 안내`, path: groupEncodedPath(g) })))]} />
      <section className="sec">
        <div className="wrap">
          <h1 className="page-h1">지역별 두피문신 안내</h1>
          <p className="head-sub">시술은 광주 서구 풍암동 한 곳에서 합니다. 지역마다 오시는 길과 자주 묻는 내용을 정리했습니다.</p>
          <div className="kw-links" data-reveal>
            <ul>{groups.map(([g, ps]) => <li key={g}><Link href={groupPath(g)}>{g} 안내</Link></li>)}</ul>
          </div>
        </div>
      </section>
      <section className="sec tint"><div className="wrap"><Head label="오시는 길" title="오시는 길" /><Location /></div></section>
    </main>
  );
}
