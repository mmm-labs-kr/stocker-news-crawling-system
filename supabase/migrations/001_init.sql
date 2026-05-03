-- 1. 유저 정보 테이블
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 뉴스 테이블
CREATE TABLE IF NOT EXISTS news (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    content         TEXT NOT NULL,
    url             VARCHAR(1000) UNIQUE,
    source          VARCHAR(100),
    published_at    TIMESTAMP,
    crawled_at      TIMESTAMP DEFAULT NOW(),
    summary         TEXT,
    sentiment       VARCHAR(20),
    sentiment_score DECIMAL(3,2),
    sentiment_reason TEXT,
    themes          JSONB,
    is_processed    BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_news_published 
  ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_themes 
  ON news USING GIN(themes);
CREATE INDEX IF NOT EXISTS idx_news_processed 
  ON news(is_processed);

-- 3. 주식 테이블
CREATE TABLE IF NOT EXISTS stocks (
    stock_code    VARCHAR(20) PRIMARY KEY,
    stock_name    VARCHAR(100) NOT NULL,
    market        VARCHAR(20),
    sector        VARCHAR(100),
    themes        JSONB,
    market_cap    BIGINT,
    current_price INTEGER,
    is_active     BOOLEAN DEFAULT TRUE,
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stocks_themes 
  ON stocks USING GIN(themes);
CREATE INDEX IF NOT EXISTS idx_stocks_sector 
  ON stocks(sector);

-- 4. 뉴스-주식 매핑 테이블
CREATE TABLE IF NOT EXISTS news_stock_map (
    id             SERIAL PRIMARY KEY,
    news_id        INTEGER REFERENCES news(id) ON DELETE CASCADE,
    stock_code     VARCHAR(20) REFERENCES stocks(stock_code) ON DELETE CASCADE,
    matched_themes JSONB,
    priority_score DECIMAL(5,2),
    created_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE(news_id, stock_code)
);

CREATE INDEX IF NOT EXISTS idx_map_news 
  ON news_stock_map(news_id);
CREATE INDEX IF NOT EXISTS idx_map_stock 
  ON news_stock_map(stock_code);
CREATE INDEX IF NOT EXISTS idx_map_score 
  ON news_stock_map(priority_score DESC);

-- 5. 유저 뉴스 북마크 테이블
CREATE TABLE IF NOT EXISTS user_bookmarks (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, news_id)
);