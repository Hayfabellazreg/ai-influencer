import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { getAnalytics } from "../services/api";

const COLORS = ["#00ff88", "#ff4757", "#ffa502", "#1e90ff"];

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics().then(res => setData(res.data));
  }, []);

  if (!data) return (
    <div style={{ textAlign: "center", color: "#555", marginTop: "100px" }}>
      Loading analytics...
    </div>
  );

  const sentimentData = Object.entries(data.sentiment_breakdown)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const intentData = Object.entries(data.intent_breakdown)
    .map(([name, value]) => ({ name, value }));

  return (
    <div style={{ padding: "0 10px" }}>
      <h2 style={{ marginBottom: "24px", fontSize: "18px" }}>📊 Analytics Dashboard</h2>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Messages", value: data.total_messages, color: "#1e90ff", bg: "#1e90ff11" },
          { label: "User Messages", value: data.user_messages, color: "#00ff88", bg: "#00ff8811" },
          { label: "Engagement Score", value: `${data.engagement_score}%`, color: "#ffa502", bg: "#ffa50211" }
        ].map((card, i) => (
          <div key={i} style={{
            background: card.bg,
            border: `1px solid ${card.color}33`,
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: card.color }}>{card.value}</div>
            <div style={{ color: "#888", marginTop: "6px", fontSize: "13px" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

        {/* Pie chart */}
        <div style={{ background: "#0f0f1a", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "#888", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Sentiment Breakdown
          </h3>
          <PieChart width={280} height={260}>
            <Pie data={sentimentData} cx={140} cy={120} outerRadius={90} dataKey="value" label>
              {sentimentData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "8px" }} />
            <Legend />
          </PieChart>
        </div>

        {/* Bar chart */}
        <div style={{ background: "#0f0f1a", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ fontSize: "14px", color: "#888", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Intent Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={intentData}>
              <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 11 }} />
              <YAxis tick={{ fill: "#555", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: "8px" }} />
              <Bar dataKey="value" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}