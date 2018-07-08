drop table if exists users;
create table users(
    id serial primary key,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    hash_password varchar(200) NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);
