const express = require("express");
const router = express.Router();
const pool = require("../db/index");

// GET all members
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM members");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Database error");
    }
});

// CREATE member
router.post("/", async (req, res) => {
    try {
        const {
            name,
            cohort,
            graduation_year,
            track,
            role,
            linkedin_url,
            company,
            job_title
        } = req.body;

        const newMember = await pool.query(
            `INSERT INTO members 
            (name, cohort, graduation_year, track, role, linkedin_url, company, job_title)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [name, cohort, graduation_year, track, role, linkedin_url, company, job_title]
        );

        res.json(newMember.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Insert failed");
    }
});

module.exports = router;