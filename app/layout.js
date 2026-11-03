import "./globals.css";
import Link from "next/link";
import Intro from "../components/Intro";
import ChatWidget from "../components/ChatWidget";
import CookieBanner from "../components/CookieBanner";

export const metadata = {
  title: "KrushyJersey — Football Jerseys",
  description: "Clean football jerseys, simple prices.",
};

const NAV = [
  { slug: "premier-league", name: "Premier League" },
  { slug: "la-liga", name: "La Liga" },
  { slug: "serie-a", name: "Serie A" },
  { slug: "bundesliga", name: "Bundesliga" },
  { slug: "national-team", name: "World Cup 2026" },
  { slug: "retro-jerseys", name: "Retro" },
  { slug: "nba", name: "NBA" },
  { slug: "nfl", name: "NFL" },
  { slug: "mlb", name: "MLB" },
  { slug: "nhl", name: "NHL" },
  { slug: "casual-clothing", name: "Casual" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Intro />
        <ChatWidget />
        <CookieBanner />
        <header className="siteHeader">
          <Link className="logo" href="/">KRUSHY<span>JERSEY</span></Link>
          <nav>
            <Link href="/shop" prefetch={false}>Shop All</Link>
            {NAV.map(c => <Link key={c.slug} href={`/category/${c.slug}`} prefetch={false}>{c.name}</Link>)}
            <Link className="cartLink" href="/cart" prefetch={false}>Cart</Link>
          </nav>
        </header>
        {children}
        <footer>
          <div className="footerLogo">KRUSHYJERSEY</div>
          <p style={{marginBottom: "20px"}}>Clean jerseys. Simple prices.</p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px", fontSize: "12px" }}>
            <a href="/privacy" style={{ color: "var(--muted)" }}>Privacy Policy</a>
            <a href="/terms" style={{ color: "var(--muted)" }}>Terms of Service</a>
            <a href="/refund" style={{ color: "var(--muted)" }}>Refund Policy</a>
            <a href="/cookies" style={{ color: "var(--muted)" }}>Cookie Policy</a>
            <a href="/data-deletion" style={{ color: "var(--muted)" }}>Data Deletion</a>
          </div>
          <p className="muted">KrushyJersey operates as an independent reseller. All jerseys are sourced from third-party suppliers. Shipping takes 7-14 days. Business contact: support@krushyjersey.com</p>
        </footer>
      </body>
    </html>
  );
}
