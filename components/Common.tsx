// 마음에점을찍다 공통 UI — 밝은 바탕, 가운데 섹션 제목, 둥근 카드(사용자 지정 시안). 이모지 없음.
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, DISCLAIMER, REVIEWS, tel } from '../lib/site';
import { AREAS, STEPS } from '../lib/content';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}</>
);

const Arrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Bubble = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7L5.6 21l4.1-2.6c.7.1 1.5.2 2.3.2 5.5 0 10-3.6 10-8s-4.5-8-10-8z" /></svg>;

export const Cta = ({ dark }: { dark?: boolean }) => (
  <div className={`cta ${dark ? 'on-dark' : ''}`}>
    <a className="btn-kakao" href={CONTACT.kakao} target="_blank" rel="noopener noreferrer"><Bubble />카카오톡으로 사진 보내기</a>
    <a className="link" href={tel}>{CONTACT.phone}<Arrow /></a>
    <a className="link" href={CONTACT.place} target="_blank" rel="noopener noreferrer">네이버 예약<Arrow /></a>
  </div>
);

export const Head = ({ label, title, sub, left }: { no?: string; label: string; title: React.ReactNode; sub?: string; left?: boolean }) => (
  <header className={`head${left ? ' left' : ''}`} data-reveal>
    <h2>{title}</h2>
    {sub && <p className="head-sub">{sub}</p>}
  </header>
);

export const Header = () => (
  <header className="hd">
    <div className="wrap hd-in">
      <Link href="/" className="logo">{BRAND}</Link>
      <nav className="nav">
        <Link href="/#results">사례</Link>
        <Link href="/#areas">부위</Link>
        <Link href="/#academy">아카데미</Link>
        <Link href="/#location">오시는 길</Link>
        <a href={CONTACT.kakao} target="_blank" rel="noopener noreferrer" className="nav-cta">상담</a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="ft">
    <div className="wrap ft-grid">
      <div>
        <p className="ft-brand">{BRAND}</p>
        <p className="ft-en">DOT YOUR MIND · THE BEGINNING OF K-BEAUTY</p>
      </div>
      <div>
        <p className="ft-h">상담</p>
        <p>전화 {CONTACT.phone}</p>
        <p>네이버 예약 {CONTACT.naverBooking}</p>
        <p>{CONTACT.email}</p>
      </div>
      <div>
        <p className="ft-h">본점</p>
        <p>{BUSINESS.address}</p>
        <p>대표 {BUSINESS.ceo} · 사업자등록번호 {BUSINESS.bizNumber}</p>
      </div>
      <div>
        <p className="ft-h">채널</p>
        <p className="ft-links">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={CONTACT.blog} target="_blank" rel="noopener noreferrer">Blog</a>
          <a href={CONTACT.place} target="_blank" rel="noopener noreferrer">Naver Place</a>
        </p>
      </div>
    </div>
    <div className="wrap ft-note">{DISCLAIMER}<br />© {new Date().getFullYear()} {BRAND}</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky">
    <a href={CONTACT.kakao} target="_blank" rel="noopener noreferrer" className="s-kakao"><Bubble />카카오톡 상담</a>
    <a href={tel} className="s-tel">전화</a>
  </div>
);

// 사례 격자 — 사진 위, 아래 부위 메타
export const Carousel = ({ id, items }: { id: string; items: { src: string; cap: string }[] }) => (
  <div className="cases reveal-group" id={id}>
    {items.map((it, i) => (
      <figure key={it.src + i}>
        <div className="case-img"><img src={it.src} alt={`${it.cap} 두피문신 전후 사례`} loading="lazy" /></div>
        <figcaption><b>{it.cap}</b><span>사례 {String(i + 1).padStart(2, '0')}</span></figcaption>
      </figure>
    ))}
  </div>
);

// 부위 타일 — 3열(모바일 1~2열) 컴팩트 카드
export const AreaList = ({ highlight }: { highlight?: string }) => (
  <ol className="areas reveal-group">
    {AREAS.map((a) => (
      <li key={a.key} className={highlight === a.key ? 'on' : ''}>
        <img src={`/images/${a.photos[0]}.webp`} alt={`${a.name} 두피문신 사례`} loading="lazy" />
        <div><h3>{a.name}<em>{a.en}</em></h3><p>{a.desc}</p></div>
      </li>
    ))}
  </ol>
);

export const Steps = () => (
  <ol className="steps reveal-group">{STEPS.map((s, i) => <li key={s.t}><span>STEP {String(i + 1).padStart(2, '0')}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
);

export const ReviewBars = () => {
  const max = REVIEWS.keywords[0][1];
  return (
    <div className="rv">
      <ul className="rv-bars reveal-group">
        {REVIEWS.keywords.map(([k, n]) => (
          <li key={k}><span className="rv-k">{k}</span><span className="rv-bar"><i style={{ ['--w' as any]: `${(n / max) * 100}%` }} /></span><em>{n}</em></li>
        ))}
      </ul>
    </div>
  );
};

// 후기 흐름 — 한 묶음(4장×3 = 약 3,000px)이 넓은 화면보다 길고, 같은 묶음을 두 번 이어 -50% 이동하므로 끊김·공백 없음
const RV = ['review-1', 'review-2', 'review-3', 'review-4'];
const RV_SET = [...RV, ...RV, ...RV];
export const ReviewMarquee = () => (
  <div className="marq" aria-hidden="true">
    <div className="marq-track">
      {[...RV_SET, ...RV_SET].map((n, i) => <img key={i} src={`/images/${n}.webp`} alt={`${BRAND} 방문자 후기 ${(i % 4) + 1}`} loading="lazy" />)}
    </div>
  </div>
);

export const Location = ({ lead }: { lead?: string }) => (
  <div className="loc" data-reveal>
    <div>
      {lead && <p className="loc-lead">{lead}</p>}
      <p className="loc-addr">{BUSINESS.address}</p>
      <p>{BUSINESS.directions}</p>
      {CONTACT.hours && <p>운영 시간 {CONTACT.hours}</p>}
      <p className="loc-amen">{BUSINESS.amenities.join(' · ')}</p>
    </div>
    <a className="link" href={CONTACT.place} target="_blank" rel="noopener noreferrer">네이버 지도에서 보기<Arrow /></a>
  </div>
);
