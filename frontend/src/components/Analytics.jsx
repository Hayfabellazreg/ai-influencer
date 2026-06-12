import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getAnalytics } from "../services/api";

const COLORS = ["#00C49F", "#FF4444", "#FFBB28", "#0088FE"];

export default function Analytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getAnalytics().then(res => setData(res.data));
    }, []);

    if (!data) return <div>Loading analytics...</div>;

    const sentimentData = Object.entries(data.sentiment_breakdown).map(
        ([name, value]) => ({ name, value })
    );

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
            <h2>Analytics Dashboard</h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "24px"
            }}>
                <div style={{ background: "#f0f4ff", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{data.total_messages}</div>
                    <div style={{ color: "#666" }}>Total Messages</div>
                </div>
                <div style={{ background: "#f0fff4", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{data.user_messages}</div>
                    <div style={{ color: "#666" }}>User Messages</div>
                </div>
                <div style={{ background: "#fff8f0", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{data.engagement_score}%</div>
                    <div style={{ color: "#666" }}>Engagement Score</div>
                </div>
            </div>
            <h3>Sentiment Breakdown</h3>
            <PieChart width={400} height={300}>
                <Pie
                    data={sentimentData}
                    cx={200}
                    cy={150}
                    outerRadius={100}
                    dataKey="value"
                    label
                >
                    {sentimentData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}
