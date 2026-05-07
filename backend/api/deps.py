from contextlib import contextmanager
from psycopg2.extras import RealDictCursor
from pipeline.utils.db import get_connection


@contextmanager
def get_db(dict_cursor=True):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor if dict_cursor else None)
    try:
        yield conn, cur
    finally:
        cur.close()
        conn.close()
