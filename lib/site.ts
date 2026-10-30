// 사이트 설정·브랜드 사실 — 출처: maeumdot.com (2026-10-25 확인). 바뀌면 이 파일만 고친다.

export const SITE_URL = process.env.SITE_URL || 'https://maumsmp.co.kr'; // 빌드 시 SITE_URL 로 바꿈 (미리보기 포트·새 도메인)
export const BRAND = '마음에점을찍다';
export const BRAND_EN = 'DOT YOUR MIND';

export const CONTACT = {
  phone: '010-6212-0418',
  naverBooking: '0507-1309-0932',
  kakao: 'http://pf.kakao.com/_eAxmUxb/chat',
  instagram: 'https://www.instagram.com/smp_designer',
  blog: 'https://blog.naver.com/winhbh',
  place: 'https://m.place.naver.com/place/1403738952/home',
  email: 'aammla45@naver.com',
  hours: '', // 사이트에 표기 없음 — 받으면 입력
};

export const BUSINESS = {
  ceo: '김채연',
  bizNumber: '801-04-01657',
  address: '광주광역시 서구 송풍로7번길 16-6 지하 1층 (풍암동)',
  directions: '광명메이루즈 정문에서 오른쪽으로 50m 직진하면 왼쪽에 보이는 건물 지하 1층입니다.',
  amenities: ['주차', '예약', '단체 이용 가능', '남·녀 화장실 구분', '반려동물 동반'],
};

// 네이버 플레이스 수치 (사이트 표기 기준, 주기적으로 갱신)
export const REVIEWS = {
  count: 301,
  rating: '5.0',
  keywords: [
    ['분위기가 편안해요', 106], ['예약이 편리해요', 104], ['자연스러워요', 102], ['시술이 꼼꼼해요', 97],
    ['상담이 자세해요', 91], ['친절해요', 89], ['매장이 청결해요', 89], ['트렌디해요', 81],
    ['유지력이 좋아요', 79], ['맞춤 케어를 잘해줘요', 74], ['가격이 합리적이에요', 73], ['과도한 권유가 없어요', 72],
  ] as [string, number][],
};

export const DISCLAIMER = 'SMP는 두피에 색소를 넣어 겉으로 보이는 대비를 줄이는 미용 시술입니다. 탈모를 치료하거나 모발을 다시 자라게 하는 방법이 아닙니다.';

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
