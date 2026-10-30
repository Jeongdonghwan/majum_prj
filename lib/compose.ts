// 키워드 페이지 조합기 — '지역 + 단어' 키워드 하나의 본문을 만든다.
// 원칙: 가격·회차·시간 같은 수치는 쓰지 않는다(브랜드 방침). 의료 효과를 약속하지 않는다.
// 색인 전략: 공통 섹션(부위 9개·6단계·리뷰 막대)은 메인에만. 키워드 페이지는 지역 사실(data/regions-jeolla.json) + 주제 문단 + 부위 2개로 채운다.
import pagesData from '../data/site-pages.json';
import regionData from '../data/regions-jeolla.json';
import { AREAS, Area, STEPS } from './content';
import { BRAND, BUSINESS, REVIEWS } from './site';
import { j } from './ko';

export interface Page { kw: string; slug: string; term: string; region: string; level: string; parent: string; sido: string; wave: number }
interface Facts { name: string; kw: string; route: string; traits: string; nearby: string[]; note: string }
const OPEN_WAVE = Number(process.env.OPEN_WAVE || 4); // post-launch 나눠 열기: 이 묶음 이하만 빌드
export const PAGES = (pagesData.pages as Page[]).filter((p) => p.wave <= OPEN_WAVE);

// 지역 묶음(허브): 페이지가 많은 지역은 그대로, 동·읍면은 상위 지역으로
const regionCount = new Map<string, number>();
for (const p of PAGES) regionCount.set(p.region, (regionCount.get(p.region) || 0) + 1);
export const groupOf = (p: Page) => ((regionCount.get(p.region) || 0) >= 50 ? p.region : p.parent);
export const GROUPS = new Map<string, Page[]>();
for (const p of PAGES) { const g = groupOf(p); if (!GROUPS.has(g)) GROUPS.set(g, []); GROUPS.get(g)!.push(p); }
export const groupPath = (g: string) => `/area/${g.replace(/ /g, '-')}/`;
export const groupEncodedPath = (g: string) => `/area/${encodeURIComponent(g.replace(/ /g, '-'))}/`;
export const groupBySlug = (slug: string) => { let k = slug; try { k = decodeURIComponent(slug); } catch {} return [...GROUPS.keys()].find((g) => g.replace(/ /g, '-') === k); };
const FACTS = regionData.regions as Facts[];

export const getPage = (slug: string) => {
  let k = slug;
  try { k = decodeURIComponent(slug); } catch {}
  return PAGES.find((p) => p.slug === k);
};
export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;

const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; };
const pick = <T,>(arr: T[], seed: string, salt = '') => arr[hash(seed + '::' + salt) % arr.length];
export const rotate = <T,>(arr: T[], seed: string, salt = '') => { const k = hash(seed + '::' + salt) % arr.length; return [...arr.slice(k), ...arr.slice(0, k)]; };

// 지역 사실 찾기: 지역명 → 상위 → 시도
function factsOf(p: Page): Facts {
  const find = (n?: string) => n && FACTS.find((f) => f.name === n || f.name === `${n}구` || f.name === `광주 ${n}`);
  const fallback = p.sido.startsWith('전북') ? '전북' : p.region.startsWith('광주') || p.parent.startsWith('광주') || p.parent === '광산' ? '광주' : '전남';
  return find(p.region) || find(p.parent) || find(fallback) || FACTS[0];
}

// 키워드 단어 → 주제
type Topic = 'smp' | 'area' | 'academy' | 'startup' | 'compare-wig' | 'compare-medical' | 'care' | 'price';
const AREA_RULES: [RegExp, string][] = [
  [/정수리/, 'crown'], [/M자|헤어라인|이마/i, 'hairline'], [/가르마|여성|여자/, 'part'], [/삭발|대머리|민머리|머리문신/, 'shaved'],
  [/흉터|화상/, 'scar'], [/원형탈모/, 'circle'], [/구레나룻|구렛나루|옆머리/, 'side'], [/복구|제거|리터치|실패/, 'repair'],
];
function topicOf(term: string): { topic: Topic; area?: Area } {
  if (/수강|학원|교육|아카데미|자격|배우|수업|강사|트레이닝|워크샵|마스터클래스|실습|초보|취업|MP교육자/.test(term)) return { topic: 'academy' };
  if (/창업|수익/.test(term)) return { topic: 'startup' };
  if (/가발/.test(term)) return { topic: 'compare-wig' };
  if (/모발이식|병원|피부과|탈모약|처방|검사|클리닉|증모/.test(term)) return { topic: 'compare-medical' };
  if (/비용|가격/.test(term)) return { topic: 'price' };
  for (const [re, key] of AREA_RULES) if (re.test(term)) return { topic: 'area', area: AREAS.find((a) => a.key === key) };
  if (/부작용|통증|아픈|딱지|후회|회복|유지|주의|색빠짐|후관리/.test(term)) return { topic: 'care' };
  return { topic: 'smp' };
}

export function compose(p: Page) {
  const s = p.slug;
  const { topic, area } = topicOf(p.term);
  const place = p.region;
  const f = factsOf(p);
  const isHome = /서구|풍암/.test(place);
  const mainArea = area || AREAS[[0, 1, 4][hash(s) % 3]];
  const area2 = pick(AREAS.filter((a) => a.key !== mainArea.key && a.key !== 'repair'), s, 'area2');
  const near = f.nearby.slice(0, 3);

  // ---- 주제 문단 (슬롯마다 변형, 해시로 고정) ----
  const P1: Record<Topic, string[]> = {
    smp: [
      `두피문신(SMP)은 두피에 미세한 색소를 넣어 실제 모근처럼 보이게 하는 비수술 커버 시술입니다. 두피 1~2mm 깊이에 얕게 넣고, 물에 지워지지 않아 반영구적으로 남습니다.`,
      `${place}에서 두피문신을 알아보실 때 가장 많이 묻는 것은 "티가 나지 않을까"입니다. ${BRAND}는 한 번에 진하게 넣지 않고, 기존 모근과 섞이는 정도를 보며 올리기 때문에 머리를 넘겨도 선이 서지 않습니다.`,
      `비어 보이는 두피를 가리는 방법은 가발, 흑채, 모발이식, 두피문신 네 가지입니다. 그중 두피문신은 매일 손이 가지 않고, 짧은 머리에서도 유지된다는 점이 다릅니다.`,
    ],
    area: [
      `${mainArea.name} 부위는 ${j(mainArea.look, '을')} 먼저 봅니다. ${mainArea.desc}`,
      `${place}에서 ${p.term} 문의를 주시는 분 대부분이 묻는 것은 "${mainArea.name}만 해도 어색하지 않을까"입니다. 주변 모발 밀도와 색에 맞춰 넣기 때문에 한 부위만 해도 경계가 생기지 않게 디자인합니다.`,
    ],
    academy: [
      `${BRAND} 아카데미는 기계를 다루는 법보다 두피를 읽는 법을 먼저 가르칩니다. 부위마다 다른 기준을 나눠 배우고, 왜 그렇게 넣었는지 설명할 수 있을 때까지 연습합니다.`,
      `${place}에서 두피문신을 배우려는 분이 가장 먼저 확인할 것은 커리큘럼 시간표가 아니라 "실습 모델을 몇 명이나 직접 보느냐"입니다. 두상·모발 사례를 많이 봐야 판단 기준이 생깁니다.`,
    ],
    startup: [
      `창업은 기술을 배운 뒤의 일입니다. ${BRAND}는 특정 매출이나 단가를 약속하지 않고, 상담부터 디자인·시술·관리 안내까지 한 고객을 끝까지 책임지는 과정을 가르칩니다.`,
      `${place}에서 두피문신 창업을 준비하신다면 상권보다 먼저 볼 것이 있습니다. 사례 사진을 스스로 만들 수 있는지, 재방문 고객에게 보강 판단을 할 수 있는지입니다.`,
    ],
    'compare-wig': [
      `가발은 모발 자체를 덮어 풍성해 보이게 하고, 두피문신은 비어 보이는 두피의 대비를 줄입니다. 짧은 머리를 원하거나 가발 관리가 번거로운 분은 두피문신이, 긴 머리 볼륨이 필요하면 가발이 맞을 수 있습니다.`,
      `${place}에서 가발과 두피문신을 함께 고민하는 분께는 "여름에 어떤 쪽이 편한가"를 먼저 묻습니다. 땀·운동·수영이 잦다면 두피문신 쪽으로 기우는 경우가 많습니다.`,
    ],
    'compare-medical': [
      `최근 갑자기 모발이 많이 빠지거나 두피에 염증·통증이 있다면, 외관을 보완하기 전에 의료기관에서 원인을 확인하시는 것이 먼저입니다.`,
      `두피문신은 치료가 아니라 겉으로 보이는 비침을 줄이는 미용 시술입니다. ${place}에서 모발이식이나 약 치료를 받은 뒤 밀도를 보강하는 방법으로 찾아오시는 분이 많습니다.`,
    ],
    care: [
      `시술 뒤 딱지와 붉은기가 생기는 정도는 사람마다 다릅니다. 자리 잡는 동안의 세안·샴푸·운동 방법은 시술 당일 안내해 드립니다.`,
      `${place}에서 두피문신 부작용을 걱정하시는 분께 먼저 말씀드리는 것은, 색이 번지거나 진해지는 문제는 대부분 한 번에 진하게 넣을 때 생긴다는 점입니다. ${BRAND}는 회차를 못 박지 않고 상태를 보며 보강합니다.`,
    ],
    price: [
      `두피문신 비용은 시술 부위와 범위, 현재 모발 상태에 따라 달라집니다. 그래서 금액을 먼저 말씀드리지 않고, 사진이나 방문 상담으로 상태를 본 뒤 안내합니다.`,
      `${place}에서 비용을 먼저 물으시는 분이 많지만, 같은 "정수리"라도 비어 보이는 범위가 손바닥 크기인지 동전 크기인지에 따라 다릅니다. 보지 않고 금액부터 부르지 않는 이유입니다.`,
    ],
  };
  const P2: Record<Topic, string[]> = {
    smp: [`${BRAND}는 색소를 자체 제작해 ORIGINAL BLACK과 SOFT BLACK 두 농도로 나눕니다. 모발이 짙고 두피 대비가 크면 오리지널, 모발 색이 옅거나 두피 톤이 밝으면 소프트 쪽으로 갑니다.`, `디자인은 얼굴형·나이·직업에 맞춥니다. 같은 정수리라도 가르마 방향과 남은 모발 굵기에 따라 점의 크기와 간격이 달라집니다.`],
    area: [`${area2.name}을 함께 보는 분도 많습니다. ${area2.desc}`, `사진을 보내주실 때는 ${mainArea.name}을 정면·위·옆 세 방향에서 찍어 주시면 범위를 정확히 볼 수 있습니다.`],
    academy: [`회차와 수강료는 상담으로 안내합니다. 수업은 위생·소독 원칙을 체계적으로 다루고, 정수리·헤어라인·가르마·흉터를 나눠 각각의 기준을 익힙니다.`, `수료 뒤에도 사례를 보내오면 보강 판단을 함께 봅니다. 혼자 결정하기 어려운 첫 1년을 넘기는 방식입니다.`],
    startup: [`수강과 창업 문의는 전화나 카카오톡으로 받습니다. 현재 경력과 준비 상황을 들려주시면 맞는 순서를 함께 정합니다.`, `협업점은 국내와 중국·뉴질랜드에 있습니다. 같은 색소와 같은 판단 기준을 쓰는 것이 조건입니다.`],
    'compare-wig': [`두 방법을 함께 쓰는 분도 있습니다. 상담에서 지금 생활과 원하는 스타일을 듣고 어느 쪽이 맞는지 솔직하게 말씀드립니다.`, `가발을 쓰다 두피문신으로 넘어오는 분은 가발 선이 닿던 헤어라인부터 봅니다. 눌린 자국과 두피 톤 차이를 먼저 맞춥니다.`],
    'compare-medical': [`모발이식 뒤 밀도가 아쉬운 부분, 이식 공여부 흉터를 두피문신으로 보완하는 경우가 흔합니다. 이식한 모발이 자리 잡은 뒤에 진행합니다.`, `탈모약을 복용 중이어도 시술은 가능합니다. 다만 최근 몇 달 사이 빠짐이 급격했다면 상태가 안정된 뒤를 권합니다.`],
    care: [`시술 뒤 일주일은 딱지를 떼지 않고, 사우나·수영·격한 운동을 쉬는 것이 핵심입니다. 그 뒤로는 평소처럼 샴푸해도 됩니다.`, `색이 빠지는 속도는 두피 상태와 자외선 노출에 따라 다릅니다. 유지 보강은 몇 년 단위로 보며, 미리 정해 두지 않습니다.`],
    price: [`카카오톡으로 정수리·이마·가르마 사진을 보내주시면 시술이 맞는지와 대략적인 방향을 먼저 말씀드립니다.`, `비용은 회차가 아니라 범위로 봅니다. 미리 회차를 못 박지 않기 때문에, 자리 잡은 상태를 보고 필요한 만큼만 보강합니다.`],
  };
  // 세 번째 문단 — 주제별로 "이 지역에서 어떻게 진행되나"를 덧붙인다
  const P3: Record<Topic, string[]> = {
    smp: [`${place}에서 처음 상담 오시는 분께는 지금 머리를 넘겼을 때와 평소 스타일 두 가지 사진을 부탁드립니다. 어느 각도에서 비어 보이는지에 따라 넣는 범위가 달라지기 때문입니다.`, `시술 당일에는 디자인을 먼저 그려 보여드리고, 동의한 범위만 진행합니다. ${f.kw}에서 멀리 오신 분은 그 자리에서 1차까지 하고, 자리 잡은 뒤 상태를 사진으로 보내주시면 보강 시점을 함께 봅니다.`],
    area: [`${mainArea.name} 시술은 디자인을 그려 보여드리는 데서 시작합니다. 그 범위에서만 넣고, ${f.kw}에서 오신 분은 자리 잡은 뒤 사진으로 상태를 보고 보강 여부를 정합니다.`, `${mainArea.name}은 머리 길이와 스타일에 따라 넣는 밀도가 다릅니다. 짧게 자르는 분과 넘기는 분을 다르게 보기 때문에, 상담 때 평소 스타일을 말씀해 주시면 됩니다.`],
    academy: [`${place}에서 수업을 들으러 오시는 분은 광주 본점에서 실습합니다. 실제 시술 현장을 옆에서 보며 두상·모발 사례를 비교하는 것이 수업의 중심입니다.`, `수강 상담에서는 지금 하시는 일과 목표를 먼저 듣습니다. 미용 경력이 있는지, 바로 창업할지 취업할지에 따라 권하는 순서가 다릅니다.`],
    startup: [`${place}에서 창업 상담을 오시면 상권 이야기보다 사례 사진부터 봅니다. 본인이 만든 시술 사례가 쌓여야 고객이 오기 때문에, 그 전에 준비할 것을 먼저 정리합니다.`, `창업 뒤에도 보강 판단이 어려운 사례는 사진을 보내오면 함께 봅니다. 첫 1년을 혼자 결정하지 않게 하는 것이 아카데미의 역할입니다.`],
    'compare-wig': [`${place}에서 가발을 쓰고 계신 분은 가발 그대로 오셔도 됩니다. 벗었을 때 상태를 보고, 두피문신으로 어디까지 되는지 그려서 보여드립니다.`, `가발과 두피문신을 함께 쓰는 분은 가발 선이 닿는 헤어라인만 두피문신으로 정리하기도 합니다. 가발을 벗어도 어색하지 않게 하는 방법입니다.`],
    'compare-medical': [`${place}에서 모발이식을 받은 뒤 오시는 분은 이식 부위와 공여부 사진을 함께 보내주세요. 이식 모발이 자리 잡은 시점인지 먼저 확인합니다.`, `탈모약을 드시는 분은 약을 끊지 않아도 됩니다. 다만 최근 몇 달 사이 빠짐이 급격했다면 상태가 안정된 뒤 시술을 권합니다.`],
    care: [`${place}에서 시술받고 돌아가신 뒤에는 사진으로 상태를 봐 드립니다. 딱지가 떨어지는 시기, 색이 자리 잡는 모습을 보고 보강 시점을 함께 정합니다.`, `자외선이 강한 여름에는 모자나 양산을 권합니다. 색이 빠지는 속도를 늦추는 가장 쉬운 방법입니다.`],
    price: [`${place}에서 사진을 보내주시면 범위와 방향을 먼저 말씀드리고, 금액은 방문 상담에서 상태를 본 뒤 확정합니다. 사진과 실제가 다른 경우가 있어서입니다.`, `비용 상담에서 함께 보는 것은 지금 범위만이 아니라 앞으로 진행될 방향입니다. 지금 넣을 범위와 나중에 보강할 범위를 나눠서 설명드립니다.`],
  };
  const intro = [pick(P1[topic], s, 'p1'), pick(P2[topic], s, 'p2'), pick(P3[topic], s, 'p3')];
  const topicTail: Record<Topic, string> = {
    smp: '시술 상담은 예약 뒤 본점에서 합니다', area: `${mainArea.name} 상담도 사진으로 먼저 봅니다`, academy: '수업도 본점에서 합니다',
    startup: '창업 상담도 본점에서 합니다', 'compare-wig': '가발을 쓴 채 오셔도 됩니다', 'compare-medical': '이식·치료 기록이 있으면 함께 가져오세요',
    care: '시술 뒤 관리 상담은 사진으로 이어갑니다', price: '금액은 상태를 본 뒤 확정합니다',
  };

  // ---- 지역 (고유 사실) ----
  const regionParas = [
    pick([
      `${j(f.kw, '은')} ${f.traits}. ${BRAND} 본점까지는 ${f.route}입니다.`,
      `${f.kw}에서 오시는 길은 ${f.route}. ${f.traits}가 있는 지역이라 ${f.note}.`.replace('.. ', '. '),
      `${BRAND}는 광주 서구 풍암동 한 곳에서 시술합니다. ${f.kw}에서는 ${f.route}이고, ${f.note}.`,
    ], s, 'r1'),
    pick([
      `${near.join('·')} 쪽에서도 같은 길로 오십니다. 먼 곳에서 오시는 분은 카카오톡으로 사진을 먼저 보내주시면, 방문 전에 시술이 맞는지부터 말씀드리고 상담과 1차 시술을 한 번에 잡습니다.`,
      `${f.note}. ${near[0]}·${near[1]} 분들과 요일이 겹치는 경우가 많아, 원하시는 날이 있으면 미리 말씀해 주세요. ${topicTail[topic]}.`,
      `${topicTail[topic]}. ${f.kw}에서 오시는 분은 ${near.join('·')} 분들과 같은 길을 쓰기 때문에, 주말보다 평일 오후가 예약이 수월합니다.`,
    ], s, 'r2'),
  ];
  const region = {
    heading: pick([`${place}에서 ${BRAND}까지`, `${f.kw}에서 오시는 분들께`, `${place} 안내`], s, 'rh'),
    paras: regionParas,
    dl: [['본점까지', f.route], ['주요 생활권', f.traits], ['함께 오는 지역', near.join(', ')]] as [string, string][],
    nearby: near,
  };

  // ---- 부위 2개 (주 + 보조) ----
  const focus = {
    heading: pick([`${place}에서 많이 보는 부위`, `${mainArea.name}과 ${area2.name}`, `부위별로 보는 것`], s, 'fh'),
    items: [
      { area: mainArea, text: `${mainArea.desc} 보는 것은 ${mainArea.look}입니다.` },
      { area: area2, text: `${area2.desc} 보는 것은 ${area2.look}입니다. ${place}에서는 ${mainArea.name}과 함께 상담하는 경우가 많습니다.` },
    ],
  };

  // ---- 과정 3단계 (6단계 중 상담·중간 하나·보강) ----
  const mid = STEPS[1 + (hash(s) % 3)];
  const steps = [
    { t: '사진 상담', d: `${place}에서 오시기 전 카카오톡으로 정면·위·옆 사진을 보내주세요. 시술이 맞는지부터 말씀드립니다.` },
    { t: mid.t, d: mid.d },
    { t: STEPS[5].t, d: STEPS[5].d },
  ];

  // ---- FAQ (지역 2 + 주제 2) ----
  const regionFaq = [
    { q: `${place}에서 본점까지 얼마나 걸리나요?`, a: `${f.route}입니다. ${BUSINESS.address}, ${BUSINESS.directions}` },
    { q: `${place} 근처에 지점이 있나요?`, a: `시술은 광주 서구 풍암동 본점 한 곳에서 합니다. ${near.join('·')} 분들도 본점으로 오시고, 거리가 멀면 사진 상담 뒤 상담과 1차 시술을 하루에 잡습니다. ${topicTail[topic]}.` },
  ];
  const topicFaq: Record<Topic, { q: string; a: string }[]> = {
    smp: [{ q: '자연스러워 보일까요?', a: '진하게 채우기보다 기존 모발과의 연결감을 맞춥니다. 모발 색과 두피 톤에 따라 두 가지 색소의 농도를 나눕니다.' }, { q: '몇 번 받아야 하나요?', a: '미리 회차를 못 박지 않습니다. 한 번에 진하게 넣지 않고, 자리 잡은 상태를 보며 필요한 만큼 보강합니다.' }, { q: '머리를 짧게 잘라도 티가 안 나나요?', a: '짧은 머리일수록 점 크기와 간격이 중요합니다. 삭발에 가까운 길이는 삭발 디자인 기준으로 따로 봅니다.' }],
    area: [{ q: `${mainArea.name}만 해도 되나요?`, a: `됩니다. 주변 모발 밀도와 색에 맞춰 넣기 때문에 한 부위만 해도 경계가 생기지 않게 디자인합니다.` }, { q: '아프거나 딱지가 생기나요?', a: '두피 1~2mm 깊이에 얕게 시술합니다. 딱지와 붉은기 정도는 사람마다 다르며, 관리법을 시술 당일 안내합니다.' }, { q: '한 번에 끝나나요?', a: '첫 시술에서 범위를 잡고, 자리 잡은 뒤 상태를 보고 보강합니다. 회차를 미리 정하지 않습니다.' }],
    academy: [{ q: '수강료와 기간은요?', a: '회차와 수강료는 전화나 카카오톡으로 안내합니다. 기간보다 실습 사례를 몇 개나 직접 보는지를 먼저 비교해 보시길 권합니다.' }, { q: '경력이 없어도 되나요?', a: '됩니다. 두피를 읽는 법부터 시작하고, 위생·소독 원칙을 체계적으로 다룹니다.' }, { q: '수업은 어디서 하나요?', a: '광주 서구 풍암동 본점에서 합니다. 실제 시술 현장을 보며 실습합니다.' }],
    startup: [{ q: '매출이 얼마나 나오나요?', a: '특정 매출이나 단가를 약속하지 않습니다. 사례를 스스로 만들고 보강 판단을 할 수 있을 때 창업을 권합니다.' }, { q: '협업점으로 할 수 있나요?', a: '같은 색소와 같은 판단 기준을 쓰는 것이 조건입니다. 상담에서 현재 준비 상황을 듣고 말씀드립니다.' }, { q: '수료 뒤 지원이 있나요?', a: '사례 사진을 보내오면 보강 판단을 함께 봅니다. 혼자 결정하기 어려운 첫 1년을 넘기는 방식입니다.' }],
    'compare-wig': [{ q: '가발 쓰다가 두피문신으로 바꿀 수 있나요?', a: '됩니다. 가발 선이 닿던 헤어라인과 두피 톤 차이부터 맞춥니다.' }, { q: '두피문신 위에 가발을 써도 되나요?', a: '됩니다. 두 방법을 함께 쓰는 분도 있습니다.' }, { q: '여름에는 어느 쪽이 편한가요?', a: '땀·운동·수영이 잦다면 두피문신 쪽이 관리가 적습니다. 상담에서 생활 패턴을 먼저 듣습니다.' }],
    'compare-medical': [{ q: '모발이식 뒤에도 받을 수 있나요?', a: '이식한 모발이 자리 잡은 뒤에 밀도 보강이나 공여부 흉터 커버로 많이 받습니다.' }, { q: '탈모가 치료되나요?', a: '아닙니다. SMP는 겉으로 보이는 대비를 줄이는 미용 시술입니다. 갑자기 많이 빠지거나 염증·통증이 있다면 의료기관에서 원인을 먼저 확인하세요.' }, { q: '탈모약을 먹으면서 받아도 되나요?', a: '됩니다. 약을 끊지 않아도 되고, 최근 빠짐이 급격했다면 안정된 뒤를 권합니다.' }],
    care: [{ q: '딱지는 얼마나 가나요?', a: '사람마다 다릅니다. 일주일은 떼지 않고 사우나·수영을 쉬는 것이 핵심이고, 그 뒤로는 평소처럼 샴푸해도 됩니다.' }, { q: '색이 빠지면 어떻게 하나요?', a: '빠지는 속도는 두피 상태와 자외선에 따라 다릅니다. 유지 보강은 몇 년 단위로 보고, 미리 정해 두지 않습니다.' }, { q: '운동은 언제부터 되나요?', a: '일주일은 사우나·수영·격한 운동을 쉬고, 그 뒤로는 평소처럼 하셔도 됩니다.' }],
    price: [{ q: '비용이 얼마인가요?', a: '부위와 범위, 현재 상태에 따라 달라져 금액을 먼저 말씀드리지 않습니다. 사진이나 방문 상담으로 상태를 본 뒤 안내합니다.' }, { q: '상담만 받아도 되나요?', a: '됩니다. 사진 상담은 카카오톡으로, 방문 상담은 예약 뒤 본점에서 받습니다.' }, { q: '사진만 보내도 금액을 알 수 있나요?', a: '범위와 방향은 사진으로 말씀드리지만, 금액은 방문 상담에서 상태를 본 뒤 확정합니다.' }],
  };
  const faq = rotate([...regionFaq, ...rotate(topicFaq[topic], s, 'tf').slice(0, 2)], s, 'faq');

  // ---- 후기 (실제 수치, 지역 주장 없이) ----
  const picks = rotate(REVIEWS.keywords, s, 'rv').slice(0, 3);
  const reviews = { line: `네이버 방문자 리뷰 ${REVIEWS.count}개, 평점 ${REVIEWS.rating}.`, picks };

  const title = pick([`${p.kw} | ${BRAND} 광주 본점`, `${p.kw} — ${f.kw}에서 ${f.route.split(/[,.]/)[0]} | ${BRAND}`, `${p.kw} | ${mainArea.name}·${area2.name} 상담 ${BRAND}`], s, 'title');
  const description = `${place} ${p.term}. ${BRAND} 광주 서구 풍암동 본점까지 ${f.route}. ${mainArea.name}·${area2.name} 사례와 상담 안내.`;
  const lead = pick([
    `${f.kw}에서 ${BRAND}까지 ${f.route}. ${P1[topic][0].split('. ')[0]}.`,
    `${place} ${p.term} 상담은 사진으로 먼저 봅니다. ${f.note}.`,
    `${mainArea.name}은 ${j(mainArea.look, '을')} 봅니다. ${f.kw}에서 오시는 길은 ${f.route}.`,
  ], s, 'lead');

  return {
    topic, area: mainArea, area2, facts: f,
    title, description, lead,
    eyebrow: `${place} · 두피문신 SMP`,
    intro, region, focus, steps, faq, reviews,
    where: isHome ? `본점은 ${place} 풍암동에 있습니다. ${BUSINESS.directions}` : `${place}에서는 ${f.route}. ${BUSINESS.directions}`,
    closing: { heading: pick([`${place}, 사진부터 보내주세요`, `${f.kw}에서 오시기 전에`, `${place} ${p.term} 상담`], s, 'ch'), text: `지금 상태 사진을 보내주시면 시술이 맞는지, 무엇부터 봐야 하는지 말씀드립니다. 방문은 ${f.route}.` },
    beforeAfter: mainArea.photos,
    showAcademy: topic === 'academy' || topic === 'startup',
  };
}
