import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def get_connection():
    # 수파베이스 연결
    conn = psycopg2.connect(
        host = os.getenv("DB_HOST"),
        port = os.getenv("DB_PORT"),
        dbname = os.getenv("DB_NAME"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD")
    )
    return conn


if __name__ == "__main__":
    try:
        conn = get_connection()
        cur = conn.cursor()


        cur.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'            
        """)

        tables = [row[0] for row in cur.fetchall()]
        print(f"생성된 테이블: {tables}")

        # 테스트 데이터 삽입
        cur.execute("""
            INSERT INTO news (title, content, url, source)
            VALUES ('제목', '내용', 'https://test.com', '출처')
            RETURNING id
        """)
        news_id = cur.fetchone()[0]
        print(f"INSERT 성공 - news_id: {news_id}")  

        # 테스트 데이터 조회
        cur.execute("SELECT * FROM news")
        row = cur.fetchone()
        print(f"전체 조회: {row}")

        cur.execute("SELECT id, title FROM news WHERE id = %s", (news_id,))
        row = cur.fetchone()
        print(f"SELECT 성공 - id: {row[0]}, title: {row[1]}")


        # 테스트 데이터 삭제
        cur.execute("DELETE FROM news WHERE id = %s", (news_id,))
        conn.commit()
        print("정리 완료")


        cur.close()
        conn.close()
        print("테스트 완료")

    except Exception as e:
        print(f"오류: {e}")
