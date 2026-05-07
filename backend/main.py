import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.news import router as news_router
from api.user import router as user_router

app = FastAPI(
    title="Stocker API",
    description="금융 뉴스 AI 요약 및 테마별 종목 매핑 서비스",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news_router, prefix="/api/v1/news")
app.include_router(user_router, prefix="/api/v1/user")


@app.get("/")
async def root():
    return {"status": "online", "message": "Welcome to Stocker API", "docs": "/docs"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
