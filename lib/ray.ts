// 키워드 페이지 본문 — 레이 모범 구조(2026-11-24): 분류 줄 → h1(키워드+수식어) → 설명 → 핵심 요약 상자 → 번호 절 6개(한 문단) → FAQ → 관련 링크.
// 규칙: ~/.claude/skills/programmatic-seo/references/composer-patterns.md §5-1·§5-2·§5-3. title·설명(lead)·주소는 compose.ts 그대로, description 은 §5-3(45~80자).
// 문장은 compose.ts·angles.ts 에 있던 것(사이트 표기 사실)만 다시 묶는다. 가격·회차·효과 약속 없음.
import { Page, compose, hashOf, rotate } from './compose';
import { ACADEMY_POINTS } from './content';
import { BRAND, CONTACT, REVIEWS } from './site';
import { j } from './ko';

const pick = <T,>(arr: T[], s: string, salt: string) => arr[hashOf(`${s}::${salt}`) % arr.length];

const SUBS: Record<string, (a: string, a2: string, look: string) => string[]> = {
  smp: (a, a2) => [`${a}·${a2} 사진 상담부터 보강까지`, '두 가지 자체 색소로 맞추는 비수술 커버', '한 번에 진하게 넣지 않고 자리 잡으며 보강'],
  area: (a, a2, look) => [`${look}부터 보는 디자인`, `${a} 사진 세 장으로 시작하는 상담`, `${j(a, '과')} ${a2} 함께 보는 범위`],
  academy: () => ['두피를 읽는 법부터 배우는 실습 수업', '부위마다 다른 기준을 나눠 익히는 과정', '본점 실습과 수료 뒤 사례 상담'],
  startup: () => ['매출 약속 대신 사례 판단부터', '상담부터 보강까지 한 고객을 끝까지', '협업점 조건과 준비 순서'],
  'compare-wig': () => ['가발과 두피문신, 생활로 고르는 기준', '여름·운동이 잦다면 먼저 볼 차이', '가발 선이 닿던 헤어라인부터 정리'],
  'compare-medical': () => ['치료가 아닌 비침을 줄이는 미용 시술', '모발이식 뒤 밀도 보강과 공여부 흉터', '탈모약 복용 중 시술 시점 정하기'],
  care: () => ['딱지·붉은기와 첫 일주일 관리', '색 번짐을 줄이는 얕은 시술과 보강', '자리 잡는 동안의 샴푸·운동 안내'],
  price: () => ['부위·범위·모발 상태로 달라지는 비용', '사진으로 범위 보고 방문 상담에서 확정', '회차가 아니라 범위로 보는 비용'],
};
const TOPIC_H: Record<string, string[]> = {
  smp: ['어떤 시술인가', '티 나지 않게 넣는 방법', '색소와 디자인'],
  area: ['부위에서 먼저 보는 것', '한 부위만 해도 되는지', '디자인 기준'],
  academy: ['무엇을 먼저 배우나', '수업에서 보는 것', '배우기 전에 확인할 것'],
  startup: ['창업 전에 준비할 것', '기술 다음의 일', '협업점과 상담'],
  'compare-wig': ['가발과 무엇이 다른가', '생활로 고르는 기준', '함께 쓰는 방법'],
  'compare-medical': ['치료와 무엇이 다른가', '이식·약 치료 뒤에', '의료기관이 먼저인 경우'],
  care: ['시술 뒤 관리', '부작용을 줄이는 방법', '색이 자리 잡는 동안'],
  price: ['비용이 정해지는 방식', '금액보다 먼저 보는 것', '사진 상담으로 범위 보기'],
};
const TOPIC_WORD: Record<string, string> = { smp: '비수술 커버', area: '부위 디자인', academy: '실습 수업', startup: '창업 준비', 'compare-wig': '가발 비교', 'compare-medical': '이식·치료 뒤 보강', care: '시술 뒤 관리', price: '비용 상담' };

export function composeRay(p: Page) {
  const c = compose(p);
  const s = p.slug;
  const kw = p.kw;
  const f = c.facts;
  const t = c.topic;
  const phone = CONTACT.phone;

  // h1 수식어 — 키워드에 이미 있는 지역명은 쓰지 않는다
  const regionWords = [...p.region.split(' '), p.parent, '광주', '풍암', '서구'].filter(Boolean);
  const subs = SUBS[t](c.area.name, c.area2.name, c.area.look);
  const ok = subs.filter((x) => !regionWords.some((w) => kw.includes(w) && x.includes(w)));
  const h1sub = pick(ok.length ? ok : subs, s, 'h1');

  const summary = [
    pick({
      smp: [`${j(kw, '은')} 두피에 미세한 색소를 넣어 모근처럼 보이게 하는 비수술 커버 시술입니다.`, `${kw}, 한 번에 진하게 넣지 않고 기존 모근과 섞이는 정도를 보며 올립니다.`],
      area: [`${c.area.name} 시술은 ${j(c.area.look, '을')} 먼저 보고 디자인합니다.`, `${kw}, 주변 모발 밀도와 색에 맞춰 넣어 한 부위만 해도 경계가 생기지 않게 합니다.`],
      academy: [`${BRAND} 아카데미는 기계보다 두피를 읽는 법을 먼저 가르칩니다.`, `${kw}, 부위마다 다른 기준을 나눠 배우고 본점 실습으로 익힙니다.`],
      startup: [`${BRAND}는 특정 매출이나 단가를 약속하지 않고, 한 고객을 끝까지 책임지는 과정을 가르칩니다.`, `${kw}, 상권보다 사례를 스스로 만들 수 있는지부터 봅니다.`],
      'compare-wig': ['가발은 모발을 덮고, 두피문신은 비어 보이는 두피의 대비를 줄입니다.', `${kw}, 짧은 머리·땀·운동이 잦은 생활이면 두피문신 쪽을 많이 고릅니다.`],
      'compare-medical': ['두피문신은 치료가 아니라 겉으로 보이는 비침을 줄이는 미용 시술입니다.', `${kw}, 갑자기 많이 빠지거나 염증이 있으면 의료기관에서 원인부터 확인합니다.`],
      care: ['시술 뒤 일주일은 딱지를 떼지 않고 사우나·수영·격한 운동을 쉬는 것이 핵심입니다.', `${kw}, 번짐 문제는 대부분 한 번에 진하게 넣을 때 생겨 얕게 넣고 보강합니다.`],
      price: ['두피문신 비용은 부위와 범위, 현재 모발 상태에 따라 달라집니다.', `${kw}, 사진이나 방문 상담으로 상태를 본 뒤 금액을 안내합니다.`],
    }[t]!, s, 's0'),
    pick([`${f.kw}에서 풍암동 본점까지는 ${f.route}입니다.`, `본점은 광주 서구 풍암동 한 곳이고, ${f.kw}에서는 ${f.route}입니다.`], s, 's1'),
    pick(['카카오톡으로 정면·위·옆 사진을 먼저 보내면 시술이 맞는지부터 말씀드립니다.', '방문 전에 사진 세 장으로 범위를 먼저 보고, 회차는 미리 정하지 않습니다.', `${p.term} 상담은 ${p.region}에서도 카카오톡 사진으로 먼저 시작합니다.`, `${p.region}에서 오시기 전에 지금 상태 사진을 보내주시면 ${p.term} 상담이 맞는지부터 봅니다.`], s, 's2'),
    pick(['탈모를 치료하는 방법이 아니라 겉으로 보이는 대비를 줄이는 미용 시술입니다.', '모발을 다시 자라게 하는 치료가 아니라는 점을 먼저 말씀드립니다.', `${p.term}도 치료가 아니라 겉으로 보이는 비침을 줄이는 쪽으로 안내합니다.`, `${c.area.name}·${c.area2.name}처럼 부위마다 기준이 달라 디자인을 먼저 그려 보여드립니다.`], s, 's3'),
  ].join(' ');

  // 절 6개 — 한 문단씩
  const reviewPara = `${pick(['받으신 분들의 평가는 네이버 플레이스에 그대로 남아 있습니다.', '시술을 받은 분들이 남긴 말도 상담 전에 참고할 만합니다.'], s, 'rv0')} 네이버 방문자 리뷰 ${REVIEWS.count}개, 평점 ${REVIEWS.rating}이고, 많이 고른 말은 ${c.reviews.picks.map(([k, v]) => `'${k}'(${v})`).join(', ')}입니다. ${pick([`${p.region}에서 오시는 분도 같은 기준으로 상담하고 시술합니다.`, '상담에서는 지금 상태로 무엇이 되는지와 무엇이 어려운지를 같이 말씀드립니다.'], s, 'rv2')} ${pick(['과도한 권유 없이 사진부터 보고 이야기합니다.', '결정은 디자인을 그려 본 뒤에 하셔도 됩니다.'], s, 'rv3')}`;
  const academyPara = `${ACADEMY_POINTS.map((a) => `${a.t}: ${a.d}`).join(' ')} ${pick([`${p.region}에서 오시는 수강생도 광주 본점에서 실습합니다.`, '수료 뒤에도 사례를 보내오면 보강 판단을 함께 봅니다.'], s, 'ac')}`;
  const focusPara = `${c.focus.items[0].area.desc} ${pick([`${p.region} ${p.term} 상담에서 ${j(c.area.name, '은')} ${c.area.look}부터 봅니다.`, `${c.area.name} 디자인은 ${c.area.look}에 맞춰 ${p.region}에서 오신 분마다 따로 그립니다.`], s, 'fo1')} ${pick([`함께 보는 ${j(c.area2.name, '은')} ${j(c.area2.look, '을')} 기준으로 봅니다.`, `${c.area2.name}까지 같이 상담하는 경우에는 ${c.area2.look}도 함께 봅니다.`], s, 'fo2')}`;
  const m = c.steps;
  const stepsPara = `${pick([`${p.region}에서 오시면 과정은 사진 상담에서 시작합니다.`, `${p.term} 상담의 처음은 사진입니다.`, `${f.kw}에서 오시는 분도 처음은 사진 상담입니다.`], s, 'sp0')} ${m[0].d} ${pick([`이어서 ${m[1].t} 단계입니다.`, `그다음은 ${m[1].t}입니다.`], s, 'sp1')} ${m[1].d} ${pick([
    `마지막은 ${m[2].t}입니다. 자리 잡은 뒤 상태를 보고 필요한 부분만 보강하며, 회차는 미리 정하지 않습니다.`,
    `${j(f.kw, '로')} 돌아가신 뒤에는 자리 잡은 모습을 사진으로 보내주시면 보강이 필요한지 함께 봅니다.`,
    `시술 뒤 ${p.term} 상태는 사진으로 이어서 보고, 필요한 만큼만 보강합니다.`], s, 'sp2')}`;
  // 지역 문장 — 절마다 하나씩, 같은 페이지에서 겹치지 않게 섞어서 나눈다
  const near = c.region.nearby;
  const RS = rotate([
    `${near.slice(0, 2).join('·')}에서 오시는 분도 같은 기준으로 ${p.term} 상담을 합니다.`,
    `${f.kw} 쪽에서 문의하실 때는 사진과 함께 원하는 방문 요일을 적어 주시면 일정 잡기가 빠릅니다.`,
    `${p.region}에서 상담을 받으시는 분도 시술은 풍암동 본점에서 진행합니다.`,
    `${f.kw}에서 오시는 분 중에는 ${p.term} 상담과 1차 시술을 같은 날 잡는 경우가 많습니다.`,
    `${p.region} ${p.term} 문의는 카카오톡 사진으로 먼저 받습니다.`,
    `${f.kw}에서 본점까지는 ${f.route.split(/[,.]/)[0]} 거리라, 방문 전에 사진으로 범위를 먼저 맞춰 둡니다.`,
  ], s, 'rs');
  const mid = c.angle ? { h: c.angle.heading, p: c.angle.paras.join(' ') } : { h: pick([`${c.area.name}과 ${c.area2.name}`, '부위별로 보는 것', '많이 보는 부위'], s, 'fh'), p: focusPara };
  const fifth = c.angle ? { h: pick([`${c.area.name}과 ${c.area2.name}`, '부위별로 보는 것', '많이 보는 부위'], s, 'fh'), p: focusPara }
    : c.showAcademy ? { h: pick(['수업에서 배우는 네 가지', '아카데미 수업 기준'], s, 'ah'), p: academyPara } : { h: pick(['받으신 분들이 남긴 말', '네이버 리뷰로 보는 시술'], s, 'rh'), p: reviewPara };
  const raw = [
    { h: pick(TOPIC_H[t], s, 'h0'), p: `${c.intro[0]} ${c.intro[1]} ${RS[0]}` },
    { h: pick(TOPIC_H[t].filter((x) => x !== pick(TOPIC_H[t], s, 'h0')), s, 'h1x'), p: `${c.intro[2]} ${c.closing.text} ${RS[1]}` },
    { h: mid.h, p: `${mid.p} ${RS[2]}` },
    { h: c.region.heading, p: c.region.paras.join(' ') },
    { h: fifth.h, p: `${fifth.p} ${RS[3]}` },
    { h: pick(['상담부터 보강까지', '진행 순서', `${p.region}에서 오시면`], s, 'sh'), p: stepsPara },
  ];
  const KW_AT = new Set([0, 1, 2, 5]);
  const sections = raw.map((x, i) => ({ h: KW_AT.has(i) && !x.h.includes(kw) ? `${kw}${pick([': ', ' — '], s, `d${i}`)}${x.h}` : x.h, p: x.p.replace(/\.\./g, '.') }));

  const facts: [string, string][] = [['본점', '광주 서구 풍암동'], ['오시는 길', f.route], ['주로 보는 부위', `${c.area.name}·${c.area2.name}`], ['상담', `카카오톡 사진 · ${phone}`]];

  // description 45~80자: 키워드 — 부위·주제 + 사실 하나 + 전화
  const route = (f.route.split(/[,.(]/).find((x) => /\d/.test(x)) || f.route.split(/[,.(]/)[0]).trim();
  const verb = pick(['안내', '상담', '정리'], s, 'dv');
  // 50자 미만이면 SEO 점검(50~160)에 걸려 50~80 안의 첫 후보를 고른다
  const cands = ([[3, true], [2, true], [3, false], [2, false]] as [number, boolean][]).map(([n, withFact]) => {
    const words = [c.area.name, c.area2.name, TOPIC_WORD[t]].slice(3 - n);
    return `${kw} — ${words.join('·')} ${verb}. ${withFact ? `풍암동 본점까지 ${route}. ` : ''}${withFact ? '' : '카카오톡 사진 '}상담 ${phone}`;
  });
  const description = cands.find((x) => x.length >= 50 && x.length <= 80) || cands.find((x) => x.length <= 80) || cands[cands.length - 1];

  return { ...c, h1sub, summary, sections, facts, description, cat: c.eyebrow };
}
