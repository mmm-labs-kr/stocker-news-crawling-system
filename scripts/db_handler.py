import os
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
from dateutil import parser
import pandas as pd

load_dotenv()

def get_connection():
    # supabase 연결
    conn = psycopg2.connect(
        host = os.getenv("DB_HOST"),
        port = os.getenv("DB_PORT"),
        dbname = os.getenv("DB_NAME"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD")
    )
    return conn

def upload_news(df: pd.DataFrame):
    if df.empty or 'content' not in df.columns:
        print("데이터 없음")
        return

    # df에 넣을 레코드들
    records=[]
    # 스키마에 맞게 지정
    for _,row in df.iterrows():
        if not row.get('content') or str(row['content']).strip() == "":
            continue
        record = (
            row['title'],
            row['content'],
            row['url'],
            row['source'],
            row['published_at']
        )
        records.append(record)
    if not records:
        print("데이터 없음")

    conn = None
    cur = None

    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # 중복 제거
        insert_query = """
            INSERT INTO news (title, content, url, source, published_at)
            VALUES %s
            ON CONFLICT (url) DO NOTHING;
        """
        # 데이터 전송
        psycopg2.extras.execute_values(
            cur, 
            insert_query, 
            records, 
            page_size=100  # 100개씩 끊어서 전송
        )

        conn.commit()
        print("적재 완료 개수",cur.rowcount)

    except Exception as e:
        # 데이터 안꼬이게 롤백
        if conn:
            conn.rollback()
        print(f"에러 발생 : {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()