# 그냥 db에 제대로 데이터 들어갔나 확인용 코드임. 나중에 삭제

import os
import psycopg2
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

def check_inserted_data():
    """DB에 적재된 뉴스 데이터를 조회하여 터미널에 출력합니다."""
    conn = None
    cur = None
    try:
        # DB 연결
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        cur = conn.cursor()

        # 1. 전체 데이터 개수 확인
        cur.execute("SELECT count(*) FROM news;")
        total_count = cur.fetchone()[0]
        print(f"현재 DB에 저장된 총 뉴스 개수: {total_count}개\n")

        if total_count > 0:
            # 2. 가장 최근에 수집된 데이터 5건만 골라서 조회 (내림차순 정렬)
            print("수집된 뉴스 확인")
            print("-" * 70)
            
            cur.execute("""
                SELECT id,content, source, title, published_at, is_processed 
                FROM news 
                ORDER BY crawled_at DESC 
                LIMIT 5;
            """)
            
            rows = cur.fetchall()
            for row in rows:
                news_id, content,source, title, pub_date, is_processed = row
                # 제목이 너무 길면 터미널이 지저분해지므로 35글자까지만 자름
                short_title = title[:35] + ("..." if len(title) > 35 else "")
                
                print(f"[{source}] {short_title}")
                print(f" └─ DB ID: {news_id} | 발행일: {pub_date} | AI 분석 완료 여부: {is_processed}")
                print(f"내용 : {content[:30]} ...")
                print("-" * 70)
        else:
            print("DB가 비었습니다. 크롤러를 먼저 실행해서 데이터를 넣어주세요.")

    except Exception as e:
        print(f"DB 조회 중 에러 발생: {e}")
        
    finally:
        if cur: cur.close()
        if conn: conn.close()

if __name__ == "__main__":
    check_inserted_data()