const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// exports.getSigners = function() {
//   db.query('SELECT * FROM signatures;').then((results)=> {
//     console.log(results.rows);
//   }
// };

exports.insertUser = function(firstName, lastName, signature) {
    const q =
        "INSERT INTO signatures (first_name, last_name,signature) VALUES ($1, $2 ,$3) RETURNING *";

    const params = [firstName, lastName, signature];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
