const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.getSigners = function() {
    const q = "SELECT first_name,last_name FROM signatures;";
    return db.query(q).then(results => {
        return results.rows;
    });
};

exports.getSignature = function(signatureId) {
    const q = "SELECT signature FROM signatures WHERE id = $1;";

    const params = [signatureId];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};

exports.getSignersCount = function() {
    const q = "SELECT COUNT(*) FROM signatures";
    return db.query(q).then(results => {
        return results.rows[0].count;
    });
};

exports.insertUser = function(firstName, lastName, signature) {
    const q =
        "INSERT INTO signatures (first_name, last_name, signature) VALUES ($1, $2 ,$3) RETURNING *";

    const params = [firstName, lastName, signature];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
