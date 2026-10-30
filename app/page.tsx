import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, DISCLAIMER } from '../lib/site';
import { AREAS, PIGMENTS, PROFILE, ACADEMY_POINTS } from '../lib/content';
import { GROUPS, PAGES, groupPath, pageEncodedPath } from '../lib/compose';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { AreaList, Carousel, Cta, Head, JsonLd, Location, ReviewBars, ReviewMarquee, Steps } from '../components/Common';

export const metadata: Metadata = { alternates: { canonical: '/', types: { 'application/rss+xml': [{ url: '/rss.xml', title: BRAND }] } } };

const FAQ = [
  { q: '비용이 얼마인가요?', a: '부위와 범위, 현재 상태에 따라 달라져 금액을 먼저 말씀드리지 않습니다. 사진이나 방문 상담으로 상태를 본 뒤 안내합니다.' },
  { q: '몇 번 받아야 하나요?', a: '미리 회차를 못 박지 않습니다. 한 번에 진하게 넣지 않고 기존 모근과 섞이는 정도를 보며 올립니다.' },
  { q: '탈모가 치료되나요?', a: '아닙니다. 겉으로 보이는 비침을 줄이는 미용 시술입니다. 갑자기 많이 빠지거나 염증·통증이 있다면 의료기관에서 원인을 먼저 확인하세요.' },
  { q: '딱지는 얼마나 가나요?', a: '사람마다 다릅니다. 시술 당일 세안·샴푸·운동 등 관리법을 자세히 안내해 드립니다.' },
];

export default function Home() {
  const results = [
    { src: '/images/crown-1.webp', cap: '정수리' }, { src: '/images/part-1.webp', cap: '여성 가르마' },
    { src: '/images/shaved-1.webp', cap: '삭발 디자인' }, { src: '/images/scar-1.webp', cap: '화상 흉터 커버' },
    { src: '/images/hairline-3.webp', cap: '헤어라인' }, { src: '/images/side-1.webp', cap: '구레나룻' },
    { src: '/images/crown-3.webp', cap: '정수리' }, { src: '/images/part-3.webp', cap: '가르마' },
  ];
  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(PAGES.slice(0, 30).map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span><i>진하게 채우는 일이 아니라,</i></span>
              <span><i>어울리게 만드는 일.</i></span>
            </h1>
            <p className="hero-lead">기존 모발과의 연결감을 맞춥니다. 정수리, 헤어라인, 가르마, 흉터까지 부위마다 보는 기준을 나눠 디자인합니다.</p>
            <Cta />
          </div>
          <figure className="hero-figure">
            <img src="/images/designer.webp" alt={`${BRAND} 대표 김채연 원장`} />
            <figcaption>대표원장 김채연</figcaption>
          </figure>
          <p className="hero-vert" aria-hidden="true">DOT YOUR MIND</p>
        </div>
      </section>

      <section className="sec" id="results">
        <div className="wrap">
          <Head no="01" label="사례" title={<>고객들의 <em>진짜 변화</em></>} sub="부위마다 넣는 방식이 다릅니다." />
          <Carousel id="home-results" items={results} />
        </div>
      </section>

      <section className="sec tint" id="areas">
        <div className="wrap">
          <Head no="02" label="부위" title={<>부위마다 <em>봐야 하는 것</em>이 다릅니다</>} sub="아홉 가지 부위, 기준을 나눠 디자인합니다." />
          <AreaList />
        </div>
      </section>

      <section className="sec" id="process">
        <div className="wrap">
          <Head no="03" label="과정" title={<>상담부터 <em>보강까지</em></>} sub="회차를 미리 정하지 않습니다. 자리 잡는 상태를 보며 올립니다." />
          <Steps />
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap split">
          <figure className="mask" data-reveal><img src="/images/pigment.webp" alt={`${BRAND} 자체 제작 SMP 색소`} loading="lazy" /></figure>
          <div>
            <Head no="04" label="색소" title={<>두피색에 맞춘 <em>두 가지 블랙</em></>} left />
            <p className="body" data-reveal>색소를 자체 제작합니다. 두피 톤과 모발 색을 보고 농도를 나눕니다.</p>
            <ul className="pig reveal-group">{PIGMENTS.map((p) => <li key={p.name}><b>{p.name}</b>{p.d}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap split rev">
          <div>
            <Head no="05" label="대표원장" title={<>마음에점을찍다로<br />두피 문신의 <em>마침표</em>를 찍다</>} left />
            <p className="who" data-reveal>김채연</p>
            <ul className="profile reveal-group">{PROFILE.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <figure className="mask" data-reveal><img src="/images/premium.webp" alt="프리미엄 SMP 정수리 시술 결과" loading="lazy" /></figure>
        </div>
      </section>

      <section className="sec tint" id="academy">
        <div className="wrap">
          <Head no="06" label="아카데미" title={<>손기술보다 <em>관찰력</em>이 먼저입니다</>} sub="회차와 수강료는 전화나 카카오톡으로 안내합니다. 특정 매출이나 단가를 약속하지 않습니다." />
          <div className="acad">
            <ol className="acad-list reveal-group">{ACADEMY_POINTS.map((a, i) => <li key={a.t}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{a.t}</h3><p>{a.d}</p></div></li>)}</ol>
            <div className="acad-stack">
              {['academy-1', 'academy-3', 'academy-cert'].map((n, i) => <img key={n} src={`/images/${n}.webp`} alt={`${BRAND} 아카데미 수업`} loading="lazy" data-reveal style={{ transitionDelay: `${i * 120}ms` }} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="reviews">
        <div className="wrap">
          <Head no="07" label="후기" title={<>받으신 분들이 <em>직접 고른 말</em></>} />
          <ReviewBars />
        </div>
        <ReviewMarquee />
      </section>

      <section className="sec tint" id="location">
        <div className="wrap">
          <Head no="08" label="오시는 길" title={<>광주 <em>본점</em></>} />
          <Location />
        </div>
      </section>

      <section className="sec">
        <div className="wrap narrow">
          <Head no="09" label="자주 묻는 질문" title={<>묻기 전에 <em>먼저 적어 둡니다</em></>} />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
          {PAGES.length > 0 && (
            <div className="kw-links" data-reveal>
              <p className="kw-h">지역별 안내</p>
              <ul>{[...GROUPS.keys()].map((g) => <li key={g}><Link href={groupPath(g)}>{g}</Link></li>)}<li><Link href="/area/">전체 지역</Link></li></ul>
            </div>
          )}
        </div>
      </section>

      <section className="closing">
        <div className="wrap"><div className="closing-box" data-reveal>
          <h2>어디부터 봐야 할지<br />모르겠다면</h2>
          <p>지금 상태 사진 한 장을 보내주세요. 시술이 맞는지부터 말씀드립니다.</p>
          <Cta dark />
          <p className="disc">{DISCLAIMER}</p>
        </div></div>
      </section>
    </main>
  );
}
