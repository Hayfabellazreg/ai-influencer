import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000"
});

export const sendChat = (message) =>
    API.post("/chat", { message });

export const analyzeMessage = (message) =>
    API.post("/analyze", { message });

export const sendMemoryChat = (message) =>
    API.post("/memory/chat", { message });

export const getAnalytics = () =>
    API.get("/analytics");

export const processComment = (message, username) =>
    API.post("/leads/process", { message, username });

export const getHotLeads = () =>
    API.get("/leads/hot");