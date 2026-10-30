import Link from 'next/link';
import { Cta } from '../components/Common';

export default function NotFound() {
  return (
    <main><section className="sec"><div className="wrap narrow">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p className="body"><Link href="/">메인으로 돌아가</Link>거나 바로 상담하세요.</p>
      <Cta />
    </div></section></main>
  );
}
