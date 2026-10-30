import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer, StickyBar, JsonLd } from '../components/Common';
import Motion from '../components/Motion';
import { businessJsonLd } from '../lib/jsonld';
import { SITE_URL, BRAND } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `광주 두피문신 SMP 탈모 | ${BRAND}`, template: '%s' },
  description: '광주 서구 풍암동 두피문신 SMP 마음에점을찍다. 정수리·헤어라인·M자·여성 가르마·흉터 커버, 아카데미 수강·창업 상담.',
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', images: ['/images/designer.webp'] },
  verification: { google: 'PxfdYYx_rOi7N5bFaSgX2pOdm44hwA_HFpO_5Ebj3lA', other: { 'naver-site-verification': '1d924703c059bea31b6eb8e3712275e99ca13915' } },
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body>
        <JsonLd data={businessJsonLd()} />
        <Header />
        {children}
        <Footer />
        <StickyBar />
        <Motion />
      </body>
    </html>
  );
}
