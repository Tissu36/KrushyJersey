import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "#0A0A0A", border: "4px solid #3B82F6",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FFFFFF", fontSize: 44, fontWeight: 900,
          }}>KJ</div>
          <div style={{
            fontSize: 90, fontWeight: 900, color: "#FFFFFF",
            letterSpacing: 6,
          }}>KRUSHY<span style={{ color: "#666", fontWeight: 400 }}>JERSEY</span></div>
        </div>
        <div style={{ fontSize: 34, color: "#999", marginTop: 40, letterSpacing: 2 }}>
          Football Jerseys. Simple Prices.
        </div>
        <div style={{ fontSize: 24, color: "#3B82F6", marginTop: 20, letterSpacing: 1 }}>
          16,000+ jerseys · Worldwide shipping
        </div>
      </div>
    ),
    { ...size }
  );
}
