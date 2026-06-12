import { useEffect, useState } from "react";
import { getHotLeads, processComment } from "../services/api";

const scoreColor = (score) => {
    if (score >= 80) return "#ff4757";
    if (score >= 50) return "#ffa502";
    return "#2ed573";
};

export default function HotLeads() {
    const [leads, setLeads] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchLeads = () => {
        getHotLeads().then(res => setLeads(res.data.leads));
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleProcess = async () => {
        if (!message.trim()) return;
        setLoading(true);
        await processComment(message, username || "anonymous");
        await fetchLeads();
        setMessage("");
        setUsername("");
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "8px", fontSize: "18px" }}>
                🔥 Hot Leads — Purchase Intent Detector
            </h2>
            <p style={{ color: "#666", fontSize: "13px", marginBottom: "24px" }}>
                Paste a comment to detect if this follower wants to buy
            </p>

            {/* Input */}
            <div style={{
                background: "#0f0f1a",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
                border: "1px solid #1a1a2e"
            }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username (optional)"
                        style={{
                            width: "200px",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px solid #2a2a3e",
                            background: "#1a1a2e",
                            color: "white",
                            fontSize: "13px",
                            outline: "none"
                        }}
                    />
                    <input
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleProcess()}
                        placeholder="Paste a comment here..."
                        style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px solid #2a2a3e",
                            background: "#1a1a2e",
                            color: "white",
                            fontSize: "13px",
                            outline: "none"
                        }}
                    />
                    <button
                        onClick={handleProcess}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            background: loading ? "#333" : "#ff4757",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: "600",
                            fontSize: "13px"
                        }}
                    >
                        {loading ? "..." : "Analyze"}
                    </button>
                </div>
            </div>

            {/* Leads list */}
            {leads.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    color: "#444",
                    marginTop: "60px"
                }}>
                    <div style={{ fontSize: "48px" }}>🎯</div>
                    <div style={{ marginTop: "12px" }}>No hot leads yet — analyze some comments</div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {leads.map((lead, i) => (
                        <div key={i} style={{
                            background: "#0f0f1a",
                            borderRadius: "12px",
                            padding: "16px 20px",
                            border: `1px solid ${scoreColor(lead.purchase_score)}44`,
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: "16px",
                            alignItems: "center"
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                    <span style={{
                                        fontWeight: "600",
                                        color: "#fff",
                                        fontSize: "14px"
                                    }}>
                                        @{lead.username}
                                    </span>
                                    <span style={{
                                        background: scoreColor(lead.purchase_score) + "22",
                                        color: scoreColor(lead.purchase_score),
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        fontSize: "11px",
                                        border: `1px solid ${scoreColor(lead.purchase_score)}44`
                                    }}>
                                        {lead.intent}
                                    </span>
                                </div>
                                <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "8px" }}>
                                    "{lead.message}"
                                </div>
                                {lead.cta && (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <span style={{ color: "#555", fontSize: "12px" }}>Suggested reply:</span>
                                        <span style={{
                                            background: "#007bff22",
                                            color: "#007bff",
                                            padding: "3px 10px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            border: "1px solid #007bff44",
                                            cursor: "pointer"
                                        }}
                                            onClick={() => navigator.clipboard.writeText(lead.cta)}
                                            title="Click to copy"
                                        >
                                            📋 {lead.cta}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: scoreColor(lead.purchase_score)
                                }}>
                                    {lead.purchase_score}
                                </div>
                                <div style={{ fontSize: "11px", color: "#555" }}>
                                    purchase score
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}