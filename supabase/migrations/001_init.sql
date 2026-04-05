CREATE TABLE news (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    content         TEXT NOT NULL,
    url             VARCHAR(1000) UNIQUE,
    source          VARCHAR(100),
    published_at    TIMESTAMP,
    crawled_at      TIMESTAMP DEFAULT NOW(),
    summary         TEXT,
    themes          JSONB,
    is_processed    BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_news_published
  ON news(published_at DESC);
CREATE INDEX idx_news_themes
  ON news USING GIN(themes);
CREATE INDEX idx_news_processed
  ON news(is_processed);


CREATE TABLE stocks (
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

CREATE INDEX idx_stocks_themes
  ON stocks USING GIN(themes);
CREATE INDEX idx_stocks_sector
  ON stocks(sector);

CREATE TABLE news_stock_map (
    id             SERIAL PRIMARY KEY,
    news_id        INTEGER REFERENCES news(id)
                   ON DELETE CASCADE,
    stock_code     VARCHAR(20)
                   REFERENCES stocks(stock_code)
                   ON DELETE CASCADE,
    matched_themes JSONB,
    priority_score DECIMAL(5,2),
    created_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE(news_id, stock_code)
);

CREATE INDEX idx_map_news
  ON news_stock_map(news_id);
CREATE INDEX idx_map_stock
  ON news_stock_map(stock_code);
CREATE INDEX idx_map_score
  ON news_stock_map(priority_score DESC);