import { useState, useRef, useEffect } from "react";
import { sendMemoryChat, analyzeMessage } from "../services/api";

const sentimentColor = {
  positive: "#00ff88",
  negative: "#ff4757",
  neutral: "#ffa502",
  question: "#1e90ff"
};

const sentimentEmoji = {
  positive: "😊",
  negative: "😠",
  neutral: "😐",
  question: "❓"
};
export default function Chat({ messages, setMessages, liveComments, setLiveComments }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);

    setLiveComments(prev => [{
      text: input,
      time: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 9)]);

    try {
      const [chatRes, sentimentRes] = await Promise.all([
        sendMemoryChat(input),
        analyzeMessage(input)
      ]);

      const aiMsg = {
        role: "assistant",
        content: chatRes.data.response,
        sentiment: sentimentRes.data.sentiment,
        score: sentimentRes.data.score,
        intent: sentimentRes.data.intent
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", height: "calc(100vh - 80px)" }}>

      {/* Main chat */}
      <div style={{ display: "flex", flexDirection: "column", background: "#0f0f1a", borderRadius: "12px", padding: "20px" }}>
        <h2 style={{ marginBottom: "16px", color: "#fff", fontSize: "18px" }}>
          🤖 AI Influencer Chat
        </h2>

        <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#444", marginTop: "80px" }}>
              <div style={{ fontSize: "48px" }}>🎯</div>
              <div style={{ marginTop: "12px" }}>Start a conversation with your AI Influencer</div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start"
            }}>
              <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px" }}>
                {msg.role === "user" ? "You" : "AI Influencer"}
              </div>
              <div style={{
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "#007bff" : "#1a1a2e",
                maxWidth: "75%",
                lineHeight: "1.5",
                fontSize: "14px",
                border: msg.role === "assistant" ? "1px solid #2a2a3e" : "none"
              }}>
                {msg.content}
              </div>
              {msg.sentiment && (
                <div style={{
                  marginTop: "6px",
                  display: "flex",
                  gap: "8px",
                  fontSize: "11px"
                }}>
                  <span style={{
                    background: sentimentColor[msg.sentiment] + "22",
                    color: sentimentColor[msg.sentiment],
                    padding: "2px 8px",
                    borderRadius: "12px",
                    border: `1px solid ${sentimentColor[msg.sentiment]}44`
                  }}>
                    {sentimentEmoji[msg.sentiment]} {msg.sentiment}
                  </span>
                  <span style={{ color: "#555" }}>
                    intent: {msg.intent}
                  </span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#555" }}>
              <div style={{
                width: "8px", height: "8px", background: "#007bff",
                borderRadius: "50%", animation: "pulse 1s infinite"
              }}/>
              AI is thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a comment or question..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "24px",
              border: "1px solid #2a2a3e",
              background: "#1a1a2e",
              color: "white",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "12px 24px",
              background: loading ? "#333" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "24px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Live feed sidebar */}
      <div style={{ background: "#0f0f1a", borderRadius: "12px", padding: "20px", overflowY: "auto" }}>
        <h3 style={{ fontSize: "14px", color: "#888", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
          🔴 Live Comments
        </h3>
        {liveComments.length === 0 && (
          <div style={{ color: "#333", fontSize: "13px" }}>No comments yet...</div>
        )}
        {liveComments.map((c, i) => (
          <div key={i} style={{
            padding: "10px 12px",
            background: "#1a1a2e",
            borderRadius: "8px",
            marginBottom: "8px",
            borderLeft: "3px solid #007bff",
            opacity: 1 - i * 0.08
          }}>
            <div style={{ fontSize: "13px", color: "#ddd" }}>{c.text}</div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>{c.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}