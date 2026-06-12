const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PYTHON_API = "http://localhost:8000";

app.get("/", (req, res) => {
    res.json({ status: "Node gateway running" });
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    const response = await axios.post(`${PYTHON_API}/chat`, { message });
    res.json(response.data);
});

app.post("/analyze", async (req, res) => {
    const { message } = req.body;
    const response = await axios.post(`${PYTHON_API}/analyze`, { message });
    res.json(response.data);
});

app.post("/memory/chat", async (req, res) => {
    const { message } = req.body;
    const response = await axios.post(`${PYTHON_API}/memory/chat`, { message });
    res.json(response.data);
});

app.get("/analytics", async (req, res) => {
    const response = await axios.get(`${PYTHON_API}/analytics`);
    res.json(response.data);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node gateway running on port ${PORT}`);
});