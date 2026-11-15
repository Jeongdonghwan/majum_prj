// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts·content.ts 에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, BUSINESS, CONTACT, DISCLAIMER, UPDATED, tel } from '../../lib/site';
import { AREAS } from '../../lib/content';
import { GROUPS } from '../../lib/compose';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const title = `소개 | ${BRAND}`;
const description = `광주 서구 풍암동에서 두피문신(SMP) 시술을 하는 ${BRAND}입니다. 하는 일, 위치, 연락 방법을 사실대로 정리했습니다.`;
const images = ['/images/designer.webp'];
export const metadata: Metadata = {
  title, description, alternates: { canonical: '/about/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title, description, url: '/about/', images },
  twitter: { card: 'summary_large_image', title, description, images },
};

export default function About() {
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <section className="sec">
        <div className="wrap">
          <h1 className="page-h1">{BRAND} 소개</h1>
          <p className="head-sub">{BRAND}는 광주 서구 풍암동에서 두피문신(SMP) 시술을 합니다.</p>

          <h2 className="angle-h">하는 일</h2>
          <p>{AREAS.map((a) => a.name).join(', ')} 부위의 두피문신 시술을 합니다. 아카데미 수강과 창업 상담도 받습니다.</p>
          <p>{DISCLAIMER}</p>

          <h2 className="angle-h">위치</h2>
          <p>시술은 {BUSINESS.address} 한 곳에서 합니다. {BUSINESS.directions}</p>
          <p>{[...GROUPS.keys()].join(', ')} 지역에서 오시는 길은 <Link href="/area/">지역별 안내</Link>에 있습니다.</p>

          <h2 className="angle-h">연락 방법</h2>
          <p>전화 <a href={tel}>{CONTACT.phone}</a>, <a href={CONTACT.kakao} target="_blank" rel="noopener noreferrer">카카오톡 채널</a>, 이메일 <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>로 받습니다. 네이버 예약 번호는 {CONTACT.naverBooking}입니다.</p>
          {CONTACT.hours && <p>운영 시간은 {CONTACT.hours}입니다.</p>}

          <h2 className="angle-h">사업자 정보</h2>
          <p>상호는 {BRAND}, 대표는 {BUSINESS.ceo}, 사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>
          <p><a href={CONTACT.blog} target="_blank" rel="noopener noreferrer">네이버 블로그</a> · <a href={CONTACT.place} target="_blank" rel="noopener noreferrer">네이버 플레이스</a> · <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">인스타그램</a></p>
          <p>이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
        </div>
      </section>
    </main>
  );
}
