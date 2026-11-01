"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderTop: "1px solid #333", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 9998, color: "#fff", flexWrap: "wrap", gap: "10px" }}>
      <p style={{ margin: 0, fontSize: "13px", maxWidth: "600px" }}>
        We use cookies to improve your experience. Read our <a href="/cookies" style={{ color: "var(--accent)" }}>Cookie Policy</a>.
      </p>
      <button onClick={accept} style={{ background: "#fff", color: "#000", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
        Accept
      </button>
    </div>
  );
}
