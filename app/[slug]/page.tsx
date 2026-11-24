import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GROUPS, PAGES, getPage, groupEncodedPath, groupOf, groupPath, pagePath, pageEncodedPath, pageImage, rotate } from '../../lib/compose';
import { composeRay } from '../../lib/ray';
import { BRAND, BUSINESS, CONTACT, DISCLAIMER, tel } from '../../lib/site';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { Carousel, Cta, JsonLd } from '../../components/Common';

export const dynamicParams = false;
export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = composeRay(p);
  const url = pageEncodedPath(p);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: c.title, description: c.description, url, images: [`/images/${c.beforeAfter[0]}.webp`] }, twitter: { card: 'summary_large_image', title: c.title, description: c.description, images: [`/images/${c.beforeAfter[0]}.webp`] } };
}

// 레이 모범 구조: 분류 줄 → h1(키워드+수식어) → 설명 → 핵심 요약 → 번호 절 6개 → FAQ → 관련 링크 (lib/ray.ts)
export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = composeRay(p);
  const path = pageEncodedPath(p);
  const g = groupOf(p);
  const sameGroup = rotate(GROUPS.get(g)!.filter((x) => x.slug !== p.slug), p.slug, 'rel').slice(0, 6);
  const sameTerm = rotate(PAGES.filter((x) => x.term === p.term && groupOf(x) !== g), p.slug, 'term').slice(0, 4);
  const hubs = [g, ...c.region.nearby.filter((n) => GROUPS.has(n) && n !== g)].slice(0, 3);
  const listed = [...sameGroup, ...sameTerm];

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: `${g} 안내`, path: groupEncodedPath(g) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: p.region }),
        faqJsonLd(c.faq),
        ...(listed.length ? [itemListJsonLd(listed.map((x) => ({ name: x.kw, path: pageEncodedPath(x), image: pageImage(x) })))] : []),
      ]} />

      <section className="hero kw">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <nav className="crumbs"><Link href="/">{BRAND}</Link><span>/</span>{p.kw}</nav>
            <p className="x-cat">{c.cat}</p>
            <h1 className="hero-title"><span><i>{p.kw}</i></span>{' '}<span className="hero-sub">{c.h1sub}</span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Cta />
          </div>
          <figure className="hero-figure">
            <img src={`/images/${c.beforeAfter[0]}.webp`} alt={`${p.kw} ${c.area.name} 사례`} />
            <figcaption>{c.area.name} 사례</figcaption>
          </figure>
        </div>
      </section>

      <section className="sec">
        <div className="wrap x-grid">
          <div className="x-main">
            <section className="x-sum" data-reveal>
              <h2>{p.kw} 핵심 요약</h2>
              <p>{c.summary}</p>
              <dl>{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </section>
            <article className="x-article">
              {c.sections.map((x, i) => (
                <section key={i}>
                  <h2><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h2>
                  <p>{x.p}</p>
                </section>
              ))}
            </article>
            <div className="x-cases">
              <Carousel id="kw-results" items={c.beforeAfter.map((n2) => ({ src: `/images/${n2}.webp`, cap: `${c.area.name} 사례` }))} />
            </div>
            <section className="x-faq" id="faq">
              <h2>{p.kw} 자주 묻는 질문</h2>
              <div className="faq">{c.faq.map((f) => <details key={f.q}><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
            </section>
          </div>
          <aside className="x-side">
            <h3>바로 확인</h3>
            <dl>
              <div><dt>본점</dt><dd>{BUSINESS.address}</dd></div>
              <div><dt>오시는 길</dt><dd>{c.facts[1][1]}</dd></div>
            </dl>
            <a className="btn-kakao" href={CONTACT.kakao} target="_blank" rel="noopener noreferrer">카카오톡으로 사진 보내기</a>
            <a className="link" href={tel}>전화 {CONTACT.phone}</a>
          </aside>
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap x-related">
          {sameGroup.length > 0 && <div><h3>{g}, 이어서 볼 안내</h3><ul>{sameGroup.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}</Link></li>)}</ul></div>}
          {sameTerm.length > 0 && <div><h3>같은 주제, 다른 지역</h3><ul>{sameTerm.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}</Link></li>)}</ul></div>}
          <div><h3>지역 안내</h3><ul>{hubs.map((h) => <li key={h}><Link href={groupPath(h)}>{h} 안내 전체</Link></li>)}</ul></div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap"><div className="closing-box" data-reveal>
          <h2>{c.closing.heading}</h2>
          <Cta dark />
          <p className="disc">{DISCLAIMER}</p>
        </div></div>
      </section>
    </main>
  );
}
