import os
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
from supabase import create_client, Client
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

def get_supabase_client() -> Client:
    """
    Supabase 공식 클라이언트 (LangChain Vector DB 및 ORM 방식의 간편한 데이터 조작용)
    """
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        raise ValueError(".env 파일에 SUPABASE_URL과 SUPABASE_KEY가 설정되지 않았습니다.")

    return create_client(supabase_url, supabase_key)

def upload_news(df: pd.DataFrame):
    """
    수집된 뉴스 데이터를 DB에 적재 (URL 중복 제거 포함)
    """
    if df.empty or 'content' not in df.columns:
        print("적재할 데이터가 없습니다.")
        return

    # DB에 삽입할 레코드 리스트 생성
    records = []
    for _, row in df.iterrows():
        # 본문이 비어있으면 건너뜀
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
        print("유효한 데이터가 없습니다.")
        return

    conn = None
    cur = None

    try:
        conn = get_connection()
        cur = conn.cursor()

        # URL 기반 중복 방지 (ON CONFLICT DO NOTHING)
        insert_query = """
            INSERT INTO news (title, content, url, source, published_at)
            VALUES %s
            ON CONFLICT (url) DO NOTHING;
        """

        # 데이터 전송 (psycopg2.extras.execute_values 사용)
        psycopg2.extras.execute_values(
            cur, 
            insert_query, 
            records, 
            page_size=100
        )

        conn.commit()
        print(f"DB 적재 완료: {cur.rowcount}개의 새로운 뉴스 추가")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"DB 적재 중 오류 발생: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()