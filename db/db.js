const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

exports.getSigners = function() {
    const q =
        "select signatures.user_id AS s_id, users.first_name || ' ' || users.last_name AS userinfo, user_profiles.age, user_profiles.city, user_profiles.url from signatures left join users on signatures.user_id = users.id left join user_profiles on signatures.user_id = user_profiles.user_id;";
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

exports.insertSignature = function(userId, signature) {
    const q =
        "INSERT INTO signatures (user_id,signature) VALUES ($1, $2) RETURNING *";

    const params = [userId, signature];
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
    const q = "SELECT id,email,hash_password FROM users WHERE email = $1;";
    const params = [email];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};

exports.insertProfile = function(userId, age, city, url) {
    const q =
        "INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1, $2 , $3, $4) RETURNING *";

    const params = [userId, age, city, url];
    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => console.log("insertProfile sql err " + err));
};
