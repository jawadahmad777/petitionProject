drop table if exists signatures;
CREATE TABLE signatures(
  id SERIAL PRIMARY KEY,
  -- user-id int not null,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50)NOT NULL,
  signature TEXT NOT NULL
  -- create_at TIMESTAMP DEFAULT current_timestamp
);
