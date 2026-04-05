from pathlib import Path

# 1. 기준점 설정: 현재 파일(config.py)이 위치한 디렉토리의 절대 경로를 구합니다.
# 이렇게 하면 실행 위치와 상관없이 항상 일관된 경로를 보장합니다.
PIPELINE_DIR = Path(__file__).resolve().parent

# 2. 최상위 루트 폴더 (pipeline의 한 칸 위인 stocker/ 폴더)
PROJECT_ROOT = PIPELINE_DIR.parent

# 3. 자주 사용하는 경로 미리 정의
# 슬래시(/) 연산자만으로 직관적으로 경로를 이어 붙일 수 있습니다!
DATA_DIR = PIPELINE_DIR / "data"
THEMES_CSV_PATH = DATA_DIR / "themes.csv"

# 필요하다면 여기에 나중에 사용할 환경변수나 공통 상수도 추가할 수 있습니다.