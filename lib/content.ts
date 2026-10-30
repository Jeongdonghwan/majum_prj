// 브랜드 공통 콘텐츠 — 부위·과정·색소·대표 이력. 사실은 maeumdot.com 표기 기준.

export interface Area { key: string; name: string; en: string; desc: string; look: string; photos: string[] }

export const AREAS: Area[] = [
  { key: 'crown', name: '정수리', en: 'CROWN', desc: '가마 주변이 비쳐 보이는 경우, 남은 모발 사이 밀도를 채워 두피 비침을 줄입니다.', look: '가마 방향과 남은 모발의 굵기', photos: ['crown-1', 'crown-2', 'crown-3', 'crown-4'] },
  { key: 'hairline', name: '헤어라인', en: 'HAIRLINE', desc: '이마 라인이 올라간 경우 얼굴형에 맞는 높이와 모양으로 라인을 그립니다.', look: '얼굴 비율과 나이에 어울리는 라인 높이', photos: ['hairline-1', 'hairline-2', 'hairline-3', 'hairline-4'] },
  { key: 'm', name: 'M자', en: 'M SHAPE', desc: '양쪽 이마가 파인 M자 부위를 기존 라인과 이어지게 메웁니다.', look: '양쪽 대칭과 기존 라인과의 연결', photos: ['hairline-2', 'hairline-1', 'hairline-4', 'hairline-3'] },
  { key: 'shaved', name: '삭발·민머리', en: 'SHAVED', desc: '짧게 민 머리에 모근 점을 넣어 막 자른 듯한 삭발 스타일을 만듭니다.', look: '점 크기와 간격, 자연스러운 그러데이션', photos: ['shaved-1', 'shaved-2', 'shaved-3', 'shaved-4'] },
  { key: 'part', name: '여성 가르마', en: 'PARTING', desc: '가르마 선이 넓어 보이는 여성 탈모에 선 주변 밀도를 보강합니다.', look: '가르마 방향과 모발 색', photos: ['part-1', 'part-2', 'part-3', 'part-4'] },
  { key: 'scar', name: '흉터·화상 커버', en: 'SCAR', desc: '수술 흉터나 화상 자리처럼 모발이 나지 않는 부위를 주변과 비슷하게 맞춥니다.', look: '흉터 조직의 색과 결', photos: ['scar-1', 'scar-2', 'scar-3', 'shaved-1'] },
  { key: 'circle', name: '원형탈모 커버', en: 'ALOPECIA', desc: '둥글게 비어 보이는 부위를 주변 모발과 이어지게 커버합니다.', look: '부위 크기와 현재 진행 상태', photos: ['scar-3', 'crown-2', 'part-3', 'crown-4'] },
  { key: 'side', name: '구레나룻', en: 'SIDEBURN', desc: '구레나룻·옆머리 라인을 다듬어 짧은 머리에서도 정돈되어 보이게 합니다.', look: '귀 주변 라인과 옆머리 결', photos: ['side-1', 'side-2', 'side-3', 'hairline-3'] },
  { key: 'repair', name: '복구·제거·리터치', en: 'RETOUCH', desc: '다른 곳에서 받은 시술이 번지거나 색이 변한 경우 상태를 보고 보완 방법을 정합니다.', look: '기존 색소의 번짐과 색 변화', photos: ['crown-3', 'part-1', 'hairline-2', 'shaved-2'] },
];

export const STEPS = [
  { t: '상담', d: '지금 상태와 원하는 모습을 듣고, 시술이 맞는지부터 이야기합니다.' },
  { t: '두피와 모발 확인', d: '탈모 범위, 남은 모발의 굵기와 색, 두피 톤을 봅니다.' },
  { t: '디자인', d: '얼굴형과 나이, 생활에 맞춰 라인과 밀도를 정합니다.' },
  { t: '시술', d: '두피 1~2mm 깊이에 얕게, 한 번에 진하게 넣지 않고 기존 모근과 섞이는 정도를 보며 올립니다.' },
  { t: '관리 안내', d: '시술 뒤 세안·샴푸·운동 등 생활 관리법을 알려드립니다.' },
  { t: '확인과 보강', d: '자리 잡은 뒤 상태를 보고 필요한 부분을 보강합니다. 회차는 미리 못 박지 않습니다.' },
];

export const PIGMENTS = [
  { name: 'ORIGINAL BLACK', d: '모발이 짙고 두피 대비가 큰 분' },
  { name: 'SOFT BLACK', d: '모발 색이 옅거나 두피 톤이 밝은 분' },
];

export const PROFILE = [
  '마음에점을찍다 본점 대표원장 · 협업점 대표이사 · 강남·광주 대표원장',
  '업계 최초 머니투데이 방송 출연',
  '업계 최초 7년 연속 고객 만족지수 1위 수상 (KCSI 뷰티 두피·탈모 부문)',
  '대한민국 프리미엄 브랜드 대상 2021',
  '최다 수강 및 최다 시술 건수 1위 · 최초 4D SMP 실현',
  'HRC 호주 헤리티지 대학교 강사 자격증 수료 / 교육과정 이수',
  'K-beauty 전문가 연합회 전남·광주 지부장 · SMP 심사위원장 · SMP 강사',
  'SMP 기법에서 LSMP 기술 자체 개발',
  '대한문신사중앙회 정회원 · 패션타투협회 정회원',
];

export const ACADEMY_POINTS = [
  { t: '기계보다 두피를 읽는 법', d: '어디에 얼마나 넣을지 판단하는 관찰력부터 배웁니다.' },
  { t: '부위마다 다른 기준', d: '정수리·헤어라인·가르마·흉터를 나눠 각각의 기준을 익힙니다.' },
  { t: '설명할 수 있어야 아는 것', d: '왜 이렇게 넣었는지 고객에게 설명할 수 있을 때까지 연습합니다.' },
  { t: '위생과 소독은 원칙으로', d: '위생과 소독의 기본 원칙을 체계적으로 다룹니다.' },
];
