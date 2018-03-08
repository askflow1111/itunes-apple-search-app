-- \connect itunes_search_app;

-- DROP TABLE favorites;
-- DROP TABLE users;
-- DROP TABLE items;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password TEXT UNIQUE NOT NULL
);

CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  unique_id BIGINT UNIQUE NOT NULL,
  collection_censored_name VARCHAR(1024),
  track_censored_name VARCHAR(1024),
  collection_view_url VARCHAR(1024),
  currency VARCHAR(255),
  collection_price VARCHAR(255),
  wrapper_type VARCHAR(255),
  artist_name VARCHAR(1024),
  artwork_url100 VARCHAR(1024)
);

CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  items_ref_item_id BIGINT REFERENCES items(unique_id),
  user_ref_id INTEGER REFERENCES users(id)
);


