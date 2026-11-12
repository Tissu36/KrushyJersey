import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "KRUSHYJERSEY — More Than Just A Jersey",
  description: "16,000+ premium football, basketball, baseball and sports jerseys. Shop by club, league or team.",
};

const LEAGUES = [
  { slug: "premier-league",       name: "Premier League" },
  { slug: "la-liga",              name: "La Liga" },
  { slug: "bundesliga",           name: "Bundesliga" },
  { slug: "serie-a",              name: "Serie A" },
  { slug: "ligue-1-mcdonalds",    name: "Ligue 1" },
  { slug: "mls",                  name: "MLS" },
  { slug: "national-team",        name: "National Teams" },
  { slug: "retro-jerseys",        name: "Retro Jerseys" },
];
const MORE = [
  { slug: "nba",                   name: "NBA" },
  { slug: "nfl",                   name: "NFL" },
  { slug: "mlb",                   name: "MLB" },
  { slug: "nhl",                   name: "NHL" },
  { slug: "efl-championship-and-other", name: "EFL Championship" },
  { slug: "casual-clothing",       name: "Casual Clothing" },
];

const MSGS = [
  "⚡ FREE SHIPPING ON ORDERS OVER $150 CAD",
  "🌍 WORLDWIDE DELIVERY — 7 TO 14 DAYS",
  "⭐ 16,000+ PREMIUM JERSEYS IN STOCK",
  "🔒 SECURE CHECKOUT — STRIPE & MONERIS",
  "👕 CUSTOMIZATION AVAILABLE — ADD NAME & NUMBER",
];

export default function Layout({ children }) {
  const track = [...MSGS, ...MSGS];
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Announcement bar */}
        <div className="ann-bar">
          <div className="ann-track">
            {track.map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>

        {/* Header */}
        <header className="site-header">
          <Link href="/" className="logo">KRUSHY<em>JERSEY</em></Link>

          <nav className="site-nav">
            <Link href="/shop">All</Link>
            {LEAGUES.slice(0, 5).map(l => (
              <Link key={l.slug} href={`/category/${l.slug}`}>{l.name}</Link>
            ))}
            <div className="nav-drop">
              <span>More ▾</span>
              <div className="nav-drop-menu">
                {[...LEAGUES.slice(5), ...MORE].map(l => (
                  <Link key={l.slug} href={`/category/${l.slug}`}>{l.name}</Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="header-right">
            <Link href="/cart" className="icon-btn cart-btn">
              🛒 <span className="cart-count" id="cart-count">0</span>
            </Link>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer>
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="fl">KRUSHY<em>JERSEY</em></div>
                <p>More than just a jersey.</p>
              </div>
              <div className="footer-links">
                <Link href="/shop">Shop All</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/refund">Refund Policy</Link>
                <Link href="/admin">Admin</Link>
              </div>
            </div>
            <p className="footer-copy">© 2026 KrushyJersey. All rights reserved.</p>
          </div>
        </footer>

        {/* Cart count sync */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var c = JSON.parse(localStorage.getItem('krushy_cart') || '[]');
            var el = document.getElementById('cart-count');
            if (el) el.textContent = c.reduce(function(a,b){ return a+(b.qty||1); }, 0);
          } catch(e){}
        `}} />
      </body>
    </html>
  );
}
