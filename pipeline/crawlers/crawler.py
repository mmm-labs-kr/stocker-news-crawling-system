import asyncio
import httpx
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import ssl


ctx = ssl.create_default_context()
ctx.set_ciphers('DEFAULT@SECLEVEL=1')
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

PARSING_RULES = {
    "한국경제": ["#articletxt", ".article-body", 'div[itemprop="articleBody"]'],
    "매일경제": [".news_cnt_detail_wrap", "#article_body", ".sec_body"],
    "조선비즈": ["article.story-body", ".article-body"],
}
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# 본문 파싱 함수 - > 언론사별로 따로 있어야 함 -> html id가 다르기 때문에 파싱을 다 각각 해줘야 한다.
def extract_article_body(html: str, source: str) -> str:
    bs = BeautifulSoup(html, 'lxml')
    selectors = PARSING_RULES.get(source, [])
    for selector in selectors:
        body = bs.select_one(selector)
        if body:
            return body.get_text(strip=True)
    return ""

# RSS로 목록 크롤링
def fetch_rss_news(rss_url: str, source_name:str,limit:int=10)-> list:
    try:
        # 뉴스 사이트에 데이터 요청
        response = httpx.get(rss_url,headers=HEADERS,timeout = 10.0,follow_redirects=True,verify=ctx)
        soup = BeautifulSoup(response.content, 'xml')

        # xml 파일에서 태그가 item인 것들 긁어옴
        items = soup.find_all('item')[:limit]
        news_list=[]

        # news_list에 긁어온 뉴스들 삽입
        for item in items:
            news_list.append({
                "source": source_name,
                "title" : item.title.text if item.title else "",
                "url":item.link.text.strip() if item.link else "",
                "published_at":item.pubDate.text if item.pubDate else "",
                "crawled_at": datetime.now()
            })
        return news_list
    except Exception as e:
        print(f"[{source_name}] RSS 수집 실패: {e}")
        return []
#비동기식 본문 추출 함수
async def fetch_body(client, news):
    url = news['url']
    source = news['source']
    try:
        response = await client.get(
            url,
            headers = HEADERS,
            timeout=10.0,
            follow_redirects = True
        )
        if response.status_code==200:
            content = extract_article_body(response.text, source)
            if content:
                news['content'] = content
            else:
                news['content'] = ""
        else:
            news['content'] = ""
    except Exception as e:
        print(f'error fetch_body: {url} - {e}')
        news['content'] = ""

def run_crawler() -> pd.DataFrame:
    rss_targets = [
        {"source":"한국경제", "url":"https://www.hankyung.com/feed/economy"}
    ]

    all_news=[]

    # targets의 사이트에서 뉴스 목록 가져오기
    for target in rss_targets:
        print(f"{target["source"]} RSS 가져오는 중...")
        news_items = fetch_rss_news(target['url'],target['source'],limit = 10)
        all_news.extend(news_items)

    # 본문 가져오기
    if all_news:
        async def gather_all_bodies():
            async with httpx.AsyncClient() as client:
                tasks = [fetch_body(client,news) for news in all_news]
                await asyncio.gather(*tasks)
        asyncio.run(gather_all_bodies())
        print("본문 추출 완료")

    df = pd.DataFrame(all_news)
    return df

if __name__ == "__main__":
    from pipeline.crawlers.db_handler import upload_news
    result_df = run_crawler()
    
    if not result_df.empty:
        upload_news(result_df)
        print(f"db 저장 완료")
    else:
        print("수집된 데이터가 없습니다")