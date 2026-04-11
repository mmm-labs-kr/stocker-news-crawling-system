import os
from dotenv import load_dotenv
from langchain_community.document_loaders import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from pipeline.config import THEMES_CSV_PATH
from pipeline.utils.db import get_supabase_client
import time

load_dotenv()

def initialize_wics_vector_db(csv_file_path: str):
    """
    WICS CSV 파일을 읽어 Supabase Vector DB에 적재하는 1회성 스크립트
    """
    print("⏳ [초기화] WICS CSV 데이터를 로드합니다...")
    
    # 1. CSV 데이터 로드
    # NotebookLM을 통해 만든 3컬럼(세분류코드, 세분류명, 판별기준_포함및제외조건) CSV 파일 지정
    if not os.path.exists(csv_file_path):
        print(f"❌ 에러: {csv_file_path} 파일이 존재하지 않습니다.")
        return

    loader = CSVLoader(file_path=csv_file_path, encoding='utf-8')
    documents = loader.load()
    print(f"✅ 총 {len(documents)}개의 테마 문서를 로드했습니다.")

    # 2. Supabase 및 임베딩 모델 연결
    print("⏳ [초기화] Supabase에 연결하고 임베딩을 시작합니다. (시간이 조금 걸릴 수 있습니다)")
    supabase_client = get_supabase_client()

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

    # 3. 빈 Vector DB에 생성
    vector_store = SupabaseVectorStore(
        client=supabase_client,
        embedding=embeddings,
        table_name="wics_documents",
        query_name="match_documents"
    )

    # 4. 151개의 데이터를 80개씩 쪼갭니다. (1분 제한 100개를 피하기 위해 안전하게 80개로 설정)
    batch_size = 80
    
    print(f"📦 총 {len(documents)}개의 문서를 {batch_size}개씩 묶어서 저장합니다...")
    
    for i in range(0, len(documents), batch_size):
        # 80개만큼 잘라내기
        batch_docs = documents[i : i + batch_size]
        print(f"   -> [{i+1} ~ {min(i+batch_size, len(documents))}] 번째 문서 적재 중...")
        
        # 잘라낸 묶음만 DB에 적재
        vector_store.add_documents(batch_docs)
        
        # 만약 아직 더 적재할 묶음이 남았다면, 구글의 분당 제한이 초기화될 때까지 60초간 대기합니다.
        if i + batch_size < len(documents):
            print("   ⏳ 구글 API 한도 보호를 위해 60초간 대기합니다. (차 한잔 하고 오세요!)")
            time.sleep(60)

    print("🎉 [완료] WICS 데이터 Vector DB 적재가 성공적으로 끝났습니다!")

if __name__ == "__main__":
    initialize_wics_vector_db(THEMES_CSV_PATH)