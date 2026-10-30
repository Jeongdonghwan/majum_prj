"""'마음에점을찍다 사진' 폴더 → public/images/*.webp (골라서 리사이즈)

  python -I scripts/prepare_images.py "<사진 폴더>"

번호는 중복 제거 후 파일명 정렬 순서(썸네일 시트 번호)다. 골라 쓴 사진만 변환한다.
"""
import hashlib, os, sys
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'images')
os.makedirs(OUT, exist_ok=True)

files = sorted(os.listdir(SRC), key=lambda f: (len(f), f))
seen, uniq = set(), []
for f in files:
    h = hashlib.md5(open(os.path.join(SRC, f), 'rb').read()).hexdigest()
    if h not in seen:
        seen.add(h)
        uniq.append(f)

PICK = {
    # 부위별 전후
    'crown-1': 39, 'crown-2': 177, 'crown-3': 189, 'crown-4': 297,
    'hairline-1': 134, 'hairline-2': 151, 'hairline-3': 66, 'hairline-4': 74,
    'part-1': 97, 'part-2': 89, 'part-3': 159, 'part-4': 20,
    'shaved-1': 111, 'shaved-2': 178, 'shaved-3': 106, 'shaved-4': 108,
    'scar-1': 95, 'scar-2': 94, 'scar-3': 100,
    'side-1': 28, 'side-2': 278, 'side-3': 64,
    # 브랜드·아카데미
    'hero': 35, 'premium': 225, 'designer': 193, 'pigment': 170, 'pigment-2': 171,
    'academy-1': 55, 'academy-2': 128, 'academy-3': 146, 'academy-4': 148, 'academy-5': 160, 'academy-cert': 73,
    'global-1': 86, 'global-2': 243, 'network': 314,
    'review-1': 3, 'review-2': 27, 'review-3': 43, 'review-4': 10,
}
for name, idx in PICK.items():
    im = Image.open(os.path.join(SRC, uniq[idx])).convert('RGB')
    if im.width > 1000:
        im = im.resize((1000, round(im.height * 1000 / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, f'{name}.webp'), 'WEBP', quality=80, method=6)
print('saved', len(PICK), '->', OUT)
