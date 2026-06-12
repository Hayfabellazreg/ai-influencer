import { useState } from "react";
import { sendMemoryChat, analyzeMessage } from "../services/api";

export default function Chat({ messages, setMessages }) { 

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);

        try {
            const [chatRes, sentimentRes] = await Promise.all([
                sendMemoryChat(input),
                analyzeMessage(input)
            ]);

            const aiMsg = {
                role: "assistant",
                content: chatRes.data.response,
                sentiment: sentimentRes.data.sentiment
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        }

        setInput("");
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
            <h2>AI Influencer Chat</h2>
            <div style={{
                height: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                background: "#f9f9f9"
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        marginBottom: "12px",
                        textAlign: msg.role === "user" ? "right" : "left"
                    }}>
                        <span style={{
                            display: "inline-block",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            background: msg.role === "user" ? "#007bff" : "#e0e0e0",
                            color: msg.role === "user" ? "white" : "black",
                            maxWidth: "80%"
                        }}>
                            {msg.content}
                        </span>
                        {msg.sentiment && (
                            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                                sentiment: {msg.sentiment}
                            </div>
                        )}
                    </div>
                ))}
                {loading && <div>AI is typing...</div>}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Type a comment..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: "10px 20px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
