CREATE ROLE dev_user WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_user;
GRANT USAGE ON SCHEMA public TO dev_user;
GRANT USAGE ON SCHEMA dev_table TO dev_user;