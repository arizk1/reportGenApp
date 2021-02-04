const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/car-listing`
);

module.exports.insertListing = (id, make, price, mileage, seller_type) => {
    const q = `INSERT INTO listings (id, make, price, mileage, seller_type) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`;
    const params = [id, make, price, mileage, seller_type];
    return db.query(q, params);
};

module.exports.insertContacts = (listing_id, contact_date) => {
    const q = `INSERT INTO contacts (listing_id, contact_date) 
    VALUES ($1, $2) 
    RETURNING *`;
    const params = [listing_id, contact_date];
    return db.query(q, params);
};
