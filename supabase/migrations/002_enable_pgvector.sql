-- 1. 기존의 잘못된 차원 테이블/함수 싹 밀어버리기
drop function if exists match_documents;
drop table if exists wics_documents;

-- 2. 3072 차원으로 넉넉하게 새로 만들기
create table wics_documents (
  id uuid primary key default uuid_generate_v4(),
  content text,
  metadata jsonb,
  embedding vector(3072) -- ★ 여기가 768에서 3072로 바뀌었습니다!
);

-- 3. 검색 함수도 3072 차원으로 새로 만들기
create function match_documents (
  query_embedding vector(3072), -- ★ 여기도 3072로 변경!
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (wics_documents.embedding <=> query_embedding) as similarity
  from wics_documents
  where metadata @> filter
  order by wics_documents.embedding <=> query_embedding
  limit match_count;
end;
$$;