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

// exports.insertUser = function(firstName, lastName, signature) {
//     const q =
//         "INSERT INTO signatures (first_name, last_name, signature) VALUES ($1, $2 ,$3) RETURNING *";
//
//     const params = [firstName, lastName, signature];
//     return db.query(q, params).then(results => {
//         return results.rows[0];
//     });
// };
exports.insertSignature = function(userId, firstName, lastName, signature) {
    const q =
        "INSERT INTO signatures (user_id,first_name, last_name, signature) VALUES ($1, $2 ,$3,$4) RETURNING *";

    const params = [userId, firstName, lastName, signature];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
exports.createUser = function(firstName, lastName, email, password) {
    const q =
        "INSERT INTO users (first_name, last_name, email, hash_password) VALUES ($1, $2 , $3, $4) RETURNING *";

    const params = [firstName, lastName, email, password];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
exports.getEmail = function(email) {
    const q = "SELECT email,hash_password FROM users WHERE email = $1;";
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
