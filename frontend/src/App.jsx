import { useState } from "react";
import Chat from "./components/Chat";
import Analytics from "./components/Analytics";

export default function App() {
  const [page, setPage] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [liveComments, setLiveComments] = useState([]);

  return (
    <div>
      <nav style={{
        background: "#0f0f1a",
        padding: "16px 24px",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        borderBottom: "1px solid #1a1a2e"
      }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: "18px", marginRight: "24px" }}>
          🤖 AI Influencer
        </span>
        <button
          onClick={() => setPage("chat")}
          style={{
            background: page === "chat" ? "#007bff" : "transparent",
            color: "white",
            border: "1px solid #007bff",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setPage("analytics")}
          style={{
            background: page === "analytics" ? "#007bff" : "transparent",
            color: "white",
            border: "1px solid #007bff",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Analytics
        </button>
      </nav>
      <div style={{ padding: "20px" }}>
        {page === "chat" ? (
          <Chat
            messages={messages}
            setMessages={setMessages}
            liveComments={liveComments}
            setLiveComments={setLiveComments}
          />
        ) : (
          <Analytics />
        )}
      </div>
    </div>
  );
}