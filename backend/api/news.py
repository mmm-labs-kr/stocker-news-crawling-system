from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from .deps import get_db

router = APIRouter(tags=["News"])


@router.get("/")
def get_news_list(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    theme: Optional[str] = Query(None),
):
    offset = (page - 1) * limit
    where = "WHERE is_processed = TRUE"
    params: list = []

    if theme:
        where += " AND themes @> %s::jsonb"
        params.append(f'"{theme}"')

    try:
        with get_db() as (_, cur):
            cur.execute(f"SELECT count(*) FROM news {where}", params)
            total = cur.fetchone()["count"]

            cur.execute(
                f"SELECT id, title, themes, source, published_at FROM news {where} ORDER BY published_at DESC LIMIT %s OFFSET %s",
                params + [limit, offset],
            )
            return {"total_count": total, "page": page, "data": cur.fetchall()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")


@router.get("/{news_id}")
def get_news_detail(news_id: int):
    try:
        with get_db() as (_, cur):
            cur.execute(
                "SELECT id, title, summary, themes, url, source, published_at FROM news WHERE id = %s AND is_processed = TRUE",
                (news_id,),
            )
            news = cur.fetchone()
            if not news:
                raise HTTPException(status_code=404, detail="해당 뉴스를 찾을 수 없거나 아직 분석되지 않았습니다.")

            cur.execute(
                """
                SELECT s.stock_code, s.stock_name, m.priority_score
                FROM news_stock_map m
                JOIN stocks s ON m.stock_code = s.stock_code
                WHERE m.news_id = %s
                ORDER BY m.priority_score DESC
                """,
                (news_id,),
            )
            news["related_stocks"] = cur.fetchall()
            return news
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")
