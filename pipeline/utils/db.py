import os
from dotenv import load_dotenv
import psycopg2
from supabase import create_client, Client

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