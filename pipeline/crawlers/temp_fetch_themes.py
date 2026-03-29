"""
일회성 스크립트: 네이버 금융 테마 목록 크롤링
출력: pipeline/data/themes.json

"""
import httpx
from bs4 import BeautifulSoup
import json
from pathlib import Path


def fetch_all_themes() -> list[str]:
    base_url = "https://finance.naver.com/sise/theme.naver"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    all_themes = set()

    for page in range(1, 50):
        resp = httpx.get(
            base_url,
            params={"page": page},
            headers=headers,
            timeout=10.0
        )
        soup = BeautifulSoup(resp.text, "html.parser")

        links = soup.select("td.col_type1 a")

        if not links:
            if page == 1:
                print("⚠️  테마를 못 찾음. 페이지 구조 확인 필요")
                print("테이블 목록:")
                for table in soup.select("table"):
                    print(f"  class={table.get('class')}")
            break

        for a in links:
            name = a.get_text(strip=True)
            if name:
                all_themes.add(name)

        print(f"page {page}: {len(links)}개 수집 (누적 {len(all_themes)}개)")

    return sorted(all_themes)


if __name__ == "__main__":
    themes = fetch_all_themes()

    if not themes:
        print("❌ 테마 수집 실패. 셀렉터 확인 필요")
        exit(1)

    output_path = Path(__file__).parent.parent / "data" / "themes.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(
            {"count": len(themes), "themes": themes},
            f,
            ensure_ascii=False,
            indent=2
        )

    print(f"\n✅ 총 {len(themes)}개 테마 → {output_path}")
    print(f"샘플: {themes[:5]}")