DROP  TABLE IF EXISTS users;
DROP  TABLE IF EXISTS user_profile;


-- CREATE TABLE users(
--     id SERIAL PRIMARY KEY,
--     first VARCHAR(255) NOT NULL CHECK (first != ''),
--     last VARCHAR(255) NOT NULL CHECK (last != ''),
--     email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
--     password VARCHAR(255) NOT NULL CHECK (password != ''),
--     profile_pic VARCHAR(255),
--     bio VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--   );

-- CREATE TABLE user_profile(
--     id SERIAL PRIMARY KEY,
--     postal_code INTEGER,
--     house_number INTEGER,
--     street VARCHAR(255),
--     city VARCHAR(255),
--     user_id INT NOT NULL UNIQUE REFERENCES users(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
