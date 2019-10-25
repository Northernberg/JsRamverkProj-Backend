DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stocks;
CREATE TABLE IF NOT EXISTS users (
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    birthdate DATE,
    UNIQUE(email)
);

-- CREATE TABLE IF NOT EXISTS inventory (
--     userEmail VARCHAR(255) NOT NULL,
--     product_id INT NOT NULL,
--     quantity INT NOT NULL,
--     UNIQUE(userEmail)
-- );

-- CREATE TABLE IF NOT EXISTS products (
--     product_id INT PRIMARY KEY NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     img VARCHAR(255) NOT NULL,
--     price INT NOT NULL
-- );