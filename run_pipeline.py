"""
파이프라인 수동 실행 스크립트 (로컬 테스트용)

실행 방법:
    python run_pipeline.py          # 크롤링 + 분석 전체 실행
    python run_pipeline.py --crawl  # 크롤링만
    python run_pipeline.py --analyze # 분석만
"""

import sys
import argparse
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가 (pipeline 패키지 인식용)
sys.path.insert(0, str(Path(__file__).resolve().parent))


def run_crawl():
    from pipeline.crawlers.crawler import crawl_and_save
    print("=" * 50)
    print("[1단계] 뉴스 크롤링 시작")
    print("=" * 50)
    count = crawl_and_save()
    print(f"\n크롤링 완료: {count}건 저장\n")
    return count


def run_analyze():
    from pipeline.processors.analyzer import process_unprocessed_news
    print("=" * 50)
    print("[2단계] LLM 분석 시작 (테마 분류 + 요약)")
    print("=" * 50)
    process_unprocessed_news()
    print("\n분석 완료\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Stocker 뉴스 파이프라인 수동 실행")
    parser.add_argument("--crawl", action="store_true", help="크롤링만 실행")
    parser.add_argument("--analyze", action="store_true", help="분석만 실행")
    args = parser.parse_args()

    if args.crawl:
        run_crawl()
    elif args.analyze:
        run_analyze()
    else:
        # 기본: 전체 실행
        count = run_crawl()
        if count > 0:
            run_analyze()
        else:
            print("크롤링된 데이터가 없어 분석을 건너뜁니다.")
