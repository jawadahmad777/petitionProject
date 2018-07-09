drop table if exists user_profiles;
create table user_profiles(
    id serial primary key,
    user_id integer references users(id),
    age integer,
    city varchar(200),
    url text
);
