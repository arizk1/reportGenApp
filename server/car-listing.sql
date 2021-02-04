-- DROP  TABLE IF EXISTS listings;
-- DROP  TABLE IF EXISTS contacts;


CREATE TABLE listings(
    no SERIAL PRIMARY KEY,
    id INT UNIQUE,
    make VARCHAR(20),
    price INT,
    price_symbol VARCHAR(5) DEFAULT '€',
    mileage INT,
    seller_type VARCHAR(20)
  );


CREATE TABLE contacts(
    id SERIAL PRIMARY KEY,
    listing_id INT REFERENCES listings(id),
    contact_date VARCHAR(200) 
);

