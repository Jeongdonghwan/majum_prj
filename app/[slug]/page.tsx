import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GROUPS, PAGES, compose, getPage, groupEncodedPath, groupOf, groupPath, pagePath, pageEncodedPath, rotate } from '../../lib/compose';
import { ACADEMY_POINTS } from '../../lib/content';
import { BRAND, DISCLAIMER } from '../../lib/site';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { Carousel, Cta, Head, JsonLd, Location } from '../../components/Common';

export const dynamicParams = false;
export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = pageEncodedPath(p);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { title: c.title, description: c.description, url, images: [`/images/${c.beforeAfter[0]}.webp`] } };
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const path = pageEncodedPath(p);
  // 관련 페이지: 같은 지역 묶음에서 해시로 고정 10개 + 지역 허브(내 지역·인근 지역)
  const g = groupOf(p);
  const others = rotate(GROUPS.get(g)!.filter((x) => x.slug !== p.slug), p.slug, 'rel').slice(0, 10);
  const hubs = [g, ...c.region.nearby.filter((n) => GROUPS.has(n) && n !== g)].slice(0, 4);
  let n = 0;
  const no = () => String(++n).padStart(2, '0');

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: `${g} 안내`, path: groupEncodedPath(g) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: p.region }),
        faqJsonLd(c.faq),
        ...(others.length ? [itemListJsonLd(others.map((x) => ({ name: x.kw, path: pageEncodedPath(x) })))] : []),
      ]} />

      <section className="hero kw">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <nav className="crumbs"><Link href="/">{BRAND}</Link><span>/</span>{p.kw}</nav>
            <h1 className="hero-title"><span><i>{p.kw}</i></span></h1>
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
        <div className="wrap narrow">
          {c.intro.map((t, i) => <p key={i} className={i === 0 ? 'body first' : 'body'} data-reveal>{t}</p>)}
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap">
          <Head no={no()} label="오시는 길" title={c.region.heading} />
          <div className="route">
            <div className="route-text" data-reveal>{c.region.paras.map((t, i) => <p key={i} className="body">{t}</p>)}</div>
            <dl className="route-dl" data-reveal>
              {c.region.dl.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <Head no={no()} label="사례" title={`${c.area.name} 시술 사례`} />
          <Carousel id="kw-results" items={c.beforeAfter.map((n2) => ({ src: `/images/${n2}.webp`, cap: c.area.name }))} />
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap">
          <Head no={no()} label="부위" title={c.focus.heading} />
          <div className="focus">
            {c.focus.items.map((it, i) => (
              <article key={it.area.key} data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
                <img src={`/images/${it.area.photos[1]}.webp`} alt={`${p.region} ${it.area.name} 두피문신 사례`} loading="lazy" />
                <div>
                  <p className="focus-en">{it.area.en}</p>
                  <h3>{it.area.name}</h3>
                  <p>{it.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="more-link" data-reveal><Link href="/#areas">부위 9가지 전체 보기</Link></p>
        </div>
      </section>

      {c.showAcademy && (
        <section className="sec">
          <div className="wrap">
            <Head no={no()} label="아카데미" title="무엇을 배우게 되나요" />
            <div className="acad">
              <ol className="acad-list reveal-group">{ACADEMY_POINTS.map((a, i) => <li key={a.t}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{a.t}</h3><p>{a.d}</p></div></li>)}</ol>
              <div className="acad-stack">{['academy-4', 'academy-5', 'academy-cert'].map((x) => <img key={x} src={`/images/${x}.webp`} alt={`${p.region} 두피문신 교육 수업`} loading="lazy" data-reveal />)}</div>
            </div>
          </div>
        </section>
      )}

      <section className="sec">
        <div className="wrap">
          <Head no={no()} label="과정" title={`${p.region}에서 오시면`} />
          <ol className="steps reveal-group">{c.steps.map((st, i) => <li key={st.t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{st.t}</h3><p>{st.d}</p></li>)}</ol>
          <p className="more-link" data-reveal><Link href="/#process">전체 6단계 보기</Link></p>
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap narrow">
          <Head no={no()} label="자주 묻는 질문" title={`${p.kw} 자주 묻는 질문`} />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="rv-compact" data-reveal>
            <p className="rv-compact-line">{c.reviews.line} 받으신 분들이 많이 고른 말:</p>
            <ul>{c.reviews.picks.map(([k, v]) => <li key={k}><span>“{k}”</span><em>{v}</em></li>)}</ul>
            <Link href="/#reviews" className="link">리뷰 키워드 전체 보기</Link>
          </div>
          <Location lead={c.where} />
          {others.length > 0 && (
            <div className="kw-links" data-reveal><p className="kw-h">함께 보는 안내</p><ul>{others.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}</Link></li>)}{hubs.map((h) => <li key={h}><Link href={groupPath(h)}>{h} 안내 전체</Link></li>)}</ul></div>
          )}
        </div>
      </section>

      <section className="closing">
        <div className="wrap"><div className="closing-box" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Cta dark />
          <p className="disc">{DISCLAIMER}</p>
        </div></div>
      </section>
    </main>
  );
}
