const {Pool} = require('pg');
require('dotenv').config();

try {
    const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
    console.log("Connexion à la base de données réussie")

} catch(err){
    console.error("Erreur de connexion à la base de données:", err);
}

module.exports = pool;