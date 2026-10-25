"use client";
import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Yo! I'm Krushy. Need help finding a jersey or tracking an order?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "My bad, I lost connection. Try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      {isOpen && (
        <div style={{ width: "320px", height: "400px", background: "#0f0f0f", border: "1px solid #333", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden", marginBottom: "10px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "15px", background: "#111", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: "bold" }}>
            <span>KRUSHY SUPPORT</span>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#fff" : "#222", color: m.role === "user" ? "#000" : "#fff", padding: "10px 14px", borderRadius: "12px", maxWidth: "80%", fontSize: "13px", lineHeight: "1.4" }}>
                {m.content}
              </div>
            ))}
            {loading && <div style={{ color: "#888", fontSize: "12px" }}>Krushy is typing...</div>}
          </div>
          <form onSubmit={sendMessage} style={{ padding: "10px", borderTop: "1px solid #333", display: "flex", gap: "8px" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about sizing..." style={{ flex: 1, padding: "10px", background: "#222", border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px" }} />
            <button type="submit" style={{ background: "#fff", color: "#000", border: "none", borderRadius: "6px", padding: "10px 14px", cursor: "pointer", fontWeight: "bold" }}>Send</button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "24px" }}>💬</span>
      </button>
    </div>
  );
}
