import os

import jwt
from fastapi import APIRouter, HTTPException, Depends, Header, Query
from pydantic import BaseModel
from typing import Optional

from api.deps import get_db

router = APIRouter(tags=["User & Personalization"])


class ProfileUpdate(BaseModel):
    nickname: str


class StockFollowRequest(BaseModel):
    stock_code: str


class NewsBookmarkRequest(BaseModel):
    news_id: int


def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="로그인이 필요합니다. (토큰 없음)")
    token = authorization.removeprefix("Bearer ")
    secret = os.getenv("SUPABASE_JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="서버 인증 설정이 누락되었습니다.")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="토큰이 만료되었습니다.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")


@router.get("/me")
def get_my_profile(user_id: str = Depends(get_current_user_id)):
    try:
        with get_db() as (_, cur):
            cur.execute("SELECT id, email, nickname, created_at FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="유저 정보를 찾을 수 없습니다.")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")


@router.patch("/me")
def update_my_profile(profile: ProfileUpdate, user_id: str = Depends(get_current_user_id)):
    try:
        with get_db() as (conn, cur):
            cur.execute(
                "UPDATE users SET nickname = %s WHERE id = %s RETURNING id, nickname",
                (profile.nickname, user_id),
            )
            updated = cur.fetchone()
            conn.commit()
        return {"message": "프로필이 수정되었습니다.", "data": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")

@router.post("/me/bookmarks")
def bookmark_news(req: NewsBookmarkRequest, user_id: str = Depends(get_current_user_id)):
    try:
        with get_db(dict_cursor=False) as (conn, cur):
            cur.execute(
                "INSERT INTO user_bookmarks (user_id, news_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (user_id, req.news_id),
            )
            conn.commit()
        return {"message": "뉴스가 북마크에 저장되었습니다."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")


@router.get("/me/bookmarks")
def get_my_bookmarks(
    user_id: str = Depends(get_current_user_id),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
):
    offset = (page - 1) * limit
    try:
        with get_db() as (_, cur):
            cur.execute(
                """
                SELECT n.id, n.title, n.source, n.published_at, n.themes, ub.created_at as bookmarked_at
                FROM user_bookmarks ub
                JOIN news n ON ub.news_id = n.id
                WHERE ub.user_id = %s
                ORDER BY ub.created_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, limit, offset),
            )
            return {"page": page, "data": cur.fetchall()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 조회 중 오류 발생: {str(e)}")
