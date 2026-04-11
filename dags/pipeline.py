"""
Stocker 뉴스 파이프라인 DAG

매 15분 트리거 → 실행 시간 체크 → 크롤링 → LLM 분석
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone
from airflow import DAG
from airflow.operators.python import PythonOperator, ShortCircuitOperator

# ── 스케줄 판단 기준 (KST 기준) ──
# 15분 간격 실행 시간대 (장 시작 전, 장 마감 즈음 등)
FIFTEEN_MIN_WINDOWS = [
    (8, 30), (8, 45), (9, 0), (9, 15), (9, 30),
    (15, 0), (15, 15), (15, 30), (15, 45), (16, 0),
]

# 그 외 정시 실행 시간대
HOURLY_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23]


def should_run(**context):
    """현재 시각이 실행 대상 시간인지 판단 (ShortCircuit)"""
    kst = timezone(timedelta(hours=9))
    now = datetime.now(kst)
    h, m = now.hour, now.minute

    # 15분 간격 윈도우 (±2분 오차 허용)
    for wh, wm in FIFTEEN_MIN_WINDOWS:
        if h == wh and abs(m - wm) <= 2:
            print(f"✅ 15분 윈도우 매칭: {h:02d}:{m:02d}")
            return True

    # 1시간 간격 (정시, 0~5분 사이)
    if h in HOURLY_HOURS and m <= 5:
        print(f"✅ 정시 매칭: {h:02d}:{m:02d}")
        return True

    print(f"⏭️ 스킵: {h:02d}:{m:02d}")
    return False


def task_crawl(**context):
    """뉴스 크롤링 + DB 적재"""
    from pipeline.crawlers.crawler import crawl_and_save
    result_count = crawl_and_save()
    print(f"크롤링 및 저장 완료: {result_count}건")
    return result_count


def task_analyze(**context):
    """LLM 분석 (요약 + 테마 추출)"""
    from pipeline.processors.analyzer import process_unprocessed_news
    process_unprocessed_news()


# ── DAG 정의 ──
default_args = {
    "owner": "stocker-de",
    "retries": 1,
    "retry_delay": timedelta(minutes=3),
}

with DAG(
    dag_id="stocker_news_pipeline",
    default_args=default_args,
    description="뉴스 크롤링 → LLM 요약/테마 추출 파이프라인",
    schedule_interval="*/15 * * * *",    # 매 15분마다 트리거
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["stocker", "news", "pipeline"],
) as dag:

    # 1. 실행 시간인지 체크 (아니면 이후 태스크 건너뜀)
    check_schedule = ShortCircuitOperator(
        task_id="check_schedule",
        python_callable=should_run,
    )

    # 2. 뉴스 크롤링
    crawl_news = PythonOperator(
        task_id="crawl_news",
        python_callable=task_crawl,
    )

    # 3. 뉴스 분석 (LLM)
    analyze_news = PythonOperator(
        task_id="analyze_news",
        python_callable=task_analyze,
    )

    # 실행 순서: 시간체크 >> 크롤링 >> 분석
    check_schedule >> crawl_news >> analyze_news
