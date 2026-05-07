import asyncio
import httpx
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import ssl
from pipeline.utils.db import upload_news

# SSL 설정 (보안 인증서 무시 및 이전 암호화 방식 호환)
ctx = ssl.create_default_context()
ctx.set_ciphers('DEFAULT@SECLEVEL=1')
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 언론사별 본문 추출을 위한 CSS 선택자 규칙
PARSING_RULES = {
    "한국경제": ["#articletxt", ".article-body", 'div[itemprop="articleBody"]'],
    "매일경제": [".news_cnt_detail_wrap", "#article_body", ".sec_body"],
    "조선비즈": ["article.story-body", ".article-body"],
}

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def extract_article_body(html: str, source: str) -> str:
    """
    HTML 본문에서 지정된 규칙에 따라 텍스트를 추출합니다.
    """
    bs = BeautifulSoup(html, 'lxml')
    selectors = PARSING_RULES.get(source, [])
    for selector in selectors:
        body = bs.select_one(selector)
        if body:
            return body.get_text(strip=True)
    return ""

def fetch_rss_news(rss_url: str, source_name: str, limit: int = 10) -> list:
    """
    RSS 피드에서 뉴스 목록(제목, URL 등)을 가져옵니다.
    """
    try:
        response = httpx.get(rss_url, headers=HEADERS, timeout=10.0, follow_redirects=True, verify=ctx)
        soup = BeautifulSoup(response.content, 'xml')
        items = soup.find_all('item')[:limit]
        
        news_list = []
        for item in items:
            news_list.append({
                "source": source_name,
                "title": item.title.text if item.title else "",
                "url": item.link.text.strip() if item.link else "",
                "published_at": item.pubDate.text if item.pubDate else "",
                "crawled_at": datetime.now()
            })
        return news_list
    except Exception as e:
        print(f"[{source_name}] RSS 수집 실패: {e}")
        return []

async def fetch_body(client, news):
    """
    비동기 방식으로 개별 뉴스의 본문을 가져와 news 딕셔너리에 추가합니다.
    """
    url = news['url']
    source = news['source']
    try:
        # 비동기 클라이언트를 사용하여 HTTP GET 요청
        response = await client.get(
            url,
            headers=HEADERS,
            timeout=10.0,
            follow_redirects=True
        )
        if response.status_code == 200:
            content = extract_article_body(response.text, source)
            news['content'] = content if content else ""
        else:
            news['content'] = ""
    except Exception as e:
        print(f'error fetch_body: {url} - {e}')
        news['content'] = ""

def run_crawler() -> pd.DataFrame:
    """
    전체 크롤링 프로세스(RSS 수집 -> 비동기 본문 추출)를 실행합니다.
    """
    rss_targets = [
        {"source": "한국경제", "url": "https://www.hankyung.com/feed/economy"},
        {"source": "매일경제", "url": "https://www.mk.co.kr/rss/30100041/"},
        {"source": "조선비즈", "url": "https://www.chosun.com/arc/outboundfeeds/rss/category/economy/?outputType=xml"},
    ]

    all_news = []
    for target in rss_targets:
        print(f"{target['source']} RSS 가져오는 중...")
        news_items = fetch_rss_news(target['url'], target['source'], limit=10)
        all_news.extend(news_items)

    # 비동기 방식으로 본문 수집 실행
    if all_news:
        async def gather_all_bodies():
            # 하나의 클라이언트를 공유하여 효율적으로 요청 전송
            async with httpx.AsyncClient(verify=ctx) as client:
                tasks = [fetch_body(client, news) for news in all_news]
                await asyncio.gather(*tasks)
        
        print(f"총 {len(all_news)}건의 본문 비동기 추출 시작...")
        asyncio.run(gather_all_bodies())
        print("본문 추출 완료")

    return pd.DataFrame(all_news)

def crawl_and_save():
    """
    크롤링을 실행하고 결과를 DB에 저장합니다. (Airflow용)
    """
    df = run_crawler()
    if not df.empty:
        upload_news(df)
        return len(df)
    return 0

if __name__ == "__main__":
    # 데이터 수집 실행
    count = crawl_and_save()
    if count > 0:
        print(f"DB 저장 완료")
    else:
        print("수집된 데이터가 없습니다")
