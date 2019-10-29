DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    birthdate DATE,
    UNIQUE(email)
);
