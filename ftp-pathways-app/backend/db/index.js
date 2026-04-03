const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "127.0.0.1",   // 👈 CHANGE THIS
    port: 5432,
    database: "ftp_db"
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Connection error:", err.message);
    } else {
        console.log("✅ Connected to PostgreSQL");
        release();
    }
});

module.exports = pool;