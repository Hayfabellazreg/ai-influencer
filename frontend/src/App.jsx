import { useState } from "react";
import Chat from "./components/Chat";
import Analytics from "./components/Analytics";
import HotLeads from "./components/HotLeads";

export default function App() {
  const [page, setPage] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [liveComments, setLiveComments] = useState([]);

  const navBtn = (id, label) => (
    <button
      onClick={() => setPage(id)}
      style={{
        background: page === id ? "#007bff" : "transparent",
        color: "white",
        border: "1px solid #007bff",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px"
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <nav style={{
        background: "#0f0f1a",
        padding: "16px 24px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        borderBottom: "1px solid #1a1a2e"
      }}>
        <span style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
          marginRight: "24px"
        }}>
          🤖 AI Influencer
        </span>
        {navBtn("chat", "💬 Chat")}
        {navBtn("leads", "🔥 Hot Leads")}
        {navBtn("analytics", "📊 Analytics")}
      </nav>
      <div style={{ padding: "24px" }}>
        {page === "chat" && (
          <Chat
            messages={messages}
            setMessages={setMessages}
            liveComments={liveComments}
            setLiveComments={setLiveComments}
          />
        )}
        {page === "leads" && <HotLeads />}
        {page === "analytics" && <Analytics />}
      </div>
    </div>
  );
}