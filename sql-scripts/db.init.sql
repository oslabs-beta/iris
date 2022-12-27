CREATE DATABASE dev_db;

CREATE TABLE IF NOT EXISTS dev_table (
  key varchar(255) NOT NULL,
  identifier varchar(255) NOT NULL,
  metric varchar(255) NOT NULL,
  time numeric NOT NULL,
  value numeric NOT NULL
);

CREATE ROLE dev_user WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_user;
GRANT USAGE ON SCHEMA public TO dev_user;
GRANT USAGE ON SCHEMA dev_table TO dev_user;

