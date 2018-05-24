CREATE USER damola WITH PASSWORD 'damola';
GRANT ALL PRIVILEGES ON travis TO damola;
CREATE DATABASE travis;
\c travis
CREATE TYPE status AS ENUM('Not Aprroved/Rejected', 'Approved', 'Rejected', 'Resolved');
CREATE TYPE reqtype AS ENUM('Maintenance', 'Repair');
CREATE TYPE profile AS ENUM('Admin', 'User');
CREATE TABLE IF NOT EXISTS USERS(
ID UUID PRIMARY KEY NOT NULL,
FIRST_NAME VARCHAR(80) NOT NULL,
LAST_NAME VARCHAR(80) NOT NULL,
EMAIL VARCHAR(80) NOT NULL UNIQUE,
PASSWORD VARCHAR(90) NOT NULL,
JOB_TITLE VARCHAR(70) NOT NULL,
DEPARTMENT VARCHAR(70) NOT NULL,
PROFILE profile default 'User'  NOT NULL,
LOCATION VARCHAR(160) NOT NULL,
UPGRADE_ID UUID NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS REQUESTS(
ID UUID PRIMARY KEY NOT NULL,
TITLE VARCHAR(50) NOT NULL,
DESCRIPTION VARCHAR(288) NOT NULL,
status status default 'Not Aprroved/Rejected' NOT NULL,
type reqtype NOT NULL,
date_submitted date NOT NULL,
last_edited date NOT NULL,
date_resolved date,
LOCATION VARCHAR(160) NOT NULL,
REASON VARCHAR(288) NOT NULL,
userid UUID references users(ID));
