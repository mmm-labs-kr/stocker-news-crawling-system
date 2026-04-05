import os
import json
import time
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.documents import Document

# 데이터베이스 연결
from pipeline.utils.db import get_supabase_client

load_dotenv()

# Monkey patch for SupabaseVectorStore to fix compatibility with newer supabase versions
def fixed_similarity_search_by_vector_with_relevance_scores(
    self, query, k=4, filter=None, score_threshold=None, **kwargs
):
    match_documents_params = self.match_args(query, filter)
    query_builder = self._client.rpc(self.query_name, match_documents_params)
    
    if hasattr(query_builder, "limit"):
        query_builder = query_builder.limit(k)
    else:
        if hasattr(query_builder, "params"):
            query_builder.params = query_builder.params.set("limit", k)
        
    res = query_builder.execute()

    match_result = [
        (
            Document(
                metadata=search.get("metadata", {}),
                page_content=search.get("content", ""),
            ),
            search.get("similarity", 0.0),
        )
        for search in res.data
        if search.get("content")
    ]

    if score_threshold is not None:
        match_result = [
            (doc, score) for doc, score in match_result if score >= score_threshold
        ]

    return match_result

def fixed_similarity_search_by_vector_returning_embeddings(
    self, query, k=4, filter=None, **kwargs
):
    match_documents_params = self.match_args(query, filter)
    query_builder = self._client.rpc(self.query_name, match_documents_params)
    
    if hasattr(query_builder, "limit"):
        query_builder = query_builder.limit(k)
    else:
        if hasattr(query_builder, "params"):
            query_builder.params = query_builder.params.set("limit", k)
            
    res = query_builder.execute()

    return [
        (
            Document(
                metadata=search.get("metadata", {}),
                page_content=search.get("content", ""),
            ),
            search.get("embedding", []),
            search.get("similarity", 0.0),
        )
        for search in res.data
        if search.get("content")
    ]

# Apply the patches
SupabaseVectorStore.similarity_search_by_vector_with_relevance_scores = fixed_similarity_search_by_vector_with_relevance_scores
SupabaseVectorStore.similarity_search_by_vector_returning_embeddings = fixed_similarity_search_by_vector_returning_embeddings

def process_unprocessed_news():
    """
    news 테이블에서 is_processed가 false인 기사를 가져와 
    테마 분류 및 요약을 수행한 뒤 DB를 업데이트하는 함수
    """
    print("Supabase 및 LangChain 초기 설정 중...")
    
    # 1. DB 클라이언트 연결
    supabase = get_supabase_client()
    
    # 2. Vector DB (Supabase) 검색기 설정
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    vector_store = SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name="wics_documents",
        query_name="match_documents"
    )
    # 검색 결과 개수(k)를 늘려(5->10) 더 풍부한 테마 데이터를 LLM에게 제공
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 10})

    # 3. 검색 결과 가공 함수
    def merge_pages(docs):
        return "\n\n".join([doc.page_content for doc in docs])

    # 4. 프롬프트 설정 (3개 테마 추출 및 품질 개선)
    template = """
        당신은 금융/경제 뉴스 기사를 분석하고 WICS 세분류 기준에 따라 테마를 분류하는 전문가입니다.
        아래의 [WICS 테마 후보군]을 참고하여 [뉴스 기사]에 가장 적합한 테마를 최대 3개까지 선정하고, 기사를 3~4문장으로 요약해 주세요.

        [중요 지시사항]
        - 반드시 [WICS 테마 후보군]에 제공된 상세 설명 중 '포함 조건'과 '제외 조건'을 엄격하게 대조하세요.
        - 테마는 연관성이 높은 순서대로 리스트 형식으로 출력하세요.
        - 기사 내용이 특정 테마와 매우 밀접할 때만 테마를 선정하세요. (최소 1개, 최대 3개)

        [WICS 테마 후보군]
        {context}

        [뉴스 기사]
        {query}

        출력 형식 (반드시 유효한 JSON 형식으로만 출력할 것):
        {{
            "themes": ["테마명1", "테마명2", "테마명3"],
            "summary": "요약한 내용"
        }}
        """
    # JsonOutputParser를 사용하여 결과를 Python 딕셔너리로 쉽게 변환
    prompt = PromptTemplate.from_template(template)
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)
    
    rag_chain = (
        {"context": retriever | merge_pages, "query": RunnablePassthrough()}
        | prompt
        | llm
        | JsonOutputParser() # 문자열이 아닌 JSON(Dict) 객체로 반환
    )

    # 5. DB에서 처리되지 않은 뉴스 가져오기
    print("처리되지 않은 뉴스 기사를 조회합니다...")
    response = supabase.table("news").select("id, content").eq("is_processed", False).execute()
    unprocessed_news = response.data

    if not unprocessed_news:
        print("처리할 새로운 뉴스 기사가 없습니다.")
        return

    print(f"총 {len(unprocessed_news)}개의 기사를 처리합니다.")

    # 6. 순회하며 분석 및 DB 업데이트 실행
    for news in unprocessed_news:
        news_id = news['id']
        news_content = news['content']
        
        try:
            print(f"ID [{news_id}] 분석 중...")
            
            # RAG 파이프라인 실행
            result = rag_chain.invoke(news_content)
            
            # 테마 리스트를 문자열로 변환 (예: "테마1, 테마2, 테마3")
            themes_str = ", ".join(result["themes"]) if isinstance(result["themes"], list) else result["themes"]
            
            # DB 업데이트 (summary, themes 갱신 및 is_processed를 true로 변경)
            supabase.table("news").update({
                "summary": result["summary"],
                "themes": themes_str, 
                "is_processed": True
            }).eq("id", news_id).execute()
            
            print(f"ID [{news_id}] 업데이트 완료 (테마: {themes_str})")
            
            # API 호출 제한(Rate Limit) 방지: 10초 대기
            time.sleep(10) 
            
        except Exception as e:
            print(f"ID [{news_id}] 처리 중 에러 발생: {e}")
            # 에러 발생 시 진행을 위해 잠시 대기
            time.sleep(2)

if __name__ == "__main__":
    process_unprocessed_news()
