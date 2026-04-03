const express = require("express");
const cors = require("cors");
require("dotenv").config();

const membersRoutes = require("./routes/members");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/members", membersRoutes);

// test route
app.get("/", (req, res) => {
    res.send("FTP Pathways API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});