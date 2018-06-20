DROP TABLE IF EXISTS USERS,REQUESTS;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE OR REPLACE FUNCTION createCryptoId()
RETURNS TRIGGER AS $$
DECLARE
  crypto TEXT;
  query TEXT;
  found TEXT;
BEGIN
  query := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';
  LOOP
    crypto := encode(gen_random_bytes(4), 'hex');
    EXECUTE query || quote_literal(crypto) INTO found;
    IF found IS NULL THEN
      EXIT;
    END IF;
  END LOOP;
  NEW.id = crypto;
  RETURN NEW;
END;
$$ language 'plpgsql';
CREATE OR REPLACE FUNCTION createCryptoUpgradeId()
RETURNS TRIGGER AS $$
DECLARE
  crypto TEXT;
  query TEXT;
  found TEXT;
BEGIN
  query := 'SELECT UPGRADE_ID FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE UPGRADE_ID=';
  LOOP
    crypto := encode(gen_random_bytes(6), 'hex');
    EXECUTE query || quote_literal(crypto) INTO found;
    IF found IS NULL THEN
      EXIT;
    END IF;
  END LOOP;
  NEW.UPGRADE_ID = crypto;
  RETURN NEW;
END;
$$ language 'plpgsql';
CREATE OR REPLACE FUNCTION createResetToken()
RETURNS TRIGGER AS $$
DECLARE
  crypto TEXT;
  query TEXT;
  found TEXT;
BEGIN
  query := 'SELECT  FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE resetid=';
  LOOP
    crypto := encode(gen_random_bytes(5), 'hex');
    EXECUTE query || quote_literal(crypto) INTO found;
    IF found IS NULL THEN
      EXIT;
    END IF;
  END LOOP;
  NEW.resetid = crypto;
  RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TABLE IF NOT EXISTS USERS(
ID SERIAL PRIMARY KEY,
FIRST_NAME VARCHAR(25) NOT NULL,
LAST_NAME VARCHAR(25) NOT NULL,
EMAIL VARCHAR(50) NOT NULL UNIQUE,
PASSWORD VARCHAR(90) NOT NULL,
JOB_TITLE VARCHAR(30) NOT NULL,
DEPARTMENT VARCHAR(30) NOT NULL,
PROFILE SMALLINT NOT NULL,
LOCATION VARCHAR(160) NOT NULL,
UPGRADE_ID TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS REQUESTS(
ID TEXT PRIMARY KEY NOT NULL,
TITLE VARCHAR(50) NOT NULL,
DESCRIPTION VARCHAR(288) NOT NULL,
status SMALLINT NOT NULL,
type SMALLINT NOT NULL,
date_submitted date NOT NULL,
last_edited date NOT NULL,
date_resolved date,
LOCATION VARCHAR(160) NOT NULL,
REASON VARCHAR(288),
IMAGE_URL TEXT,
userid SERIAL references users(ID));
CREATE TABLE IF NOT EXISTS RESETPASSWORD(
RESETID CHAR(10),
userid SERIAL references users(ID) PRIMARY KEY,
expiryDate TIMESTAMP
);
CREATE TRIGGER insertRequestId BEFORE INSERT ON REQUESTS FOR EACH ROW EXECUTE PROCEDURE createCryptoId();
CREATE TRIGGER insertUpgradeId BEFORE INSERT ON USERS FOR EACH ROW EXECUTE PROCEDURE createCryptoUpgradeId();
CREATE TRIGGER insertToken BEFORE INSERT ON RESETPASSWORD FOR EACH ROW EXECUTE PROCEDURE createResetToken();
GRANT ALL PRIVILEGES ON USERS,REQUESTS,RESETPASSWORD TO damola;
grant all on sequence users_id_seq to damola;
