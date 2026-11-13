import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "KrushyJersey — More Than Just A Jersey",
  description: "16,000+ authentic football, basketball, baseball and sports jerseys. Shop by club, league or team.",
};

const NAV_FOOTBALL = [
  { slug: "premier-league",          name: "Premier League" },
  { slug: "la-liga",                 name: "La Liga" },
  { slug: "bundesliga",              name: "Bundesliga" },
  { slug: "serie-a",                 name: "Serie A" },
  { slug: "ligue-1-mcdonalds",       name: "Ligue 1" },
  { slug: "mls",                     name: "MLS" },
  { slug: "efl-championship-and-other", name: "EFL Championship" },
  { slug: "national-team",           name: "National Teams" },
  { slug: "retro-jerseys",           name: "Retro Jerseys" },
];
const NAV_US = [
  { slug: "nba",  name: "NBA" },
  { slug: "nfl",  name: "NFL" },
  { slug: "mlb",  name: "MLB" },
  { slug: "nhl",  name: "NHL" },
];
const NAV_OTHER = [
  { slug: "casual-clothing", name: "Casual Clothing" },
];

const MSGS = [
  "Free shipping on orders over $150 CAD",
  "Worldwide delivery — 7 to 14 days",
  "16,000+ authentic jerseys in stock",
  "Add name & number customization",
  "Secure checkout — Stripe & Moneris",
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
        <div className="ann-bar">
          <div className="ann-track">
            {track.map((m, i) => <span key={i}>— {m}</span>)}
          </div>
        </div>

        <header className="site-header">
          <Link href="/" className="logo">Krushy<em>Jersey</em></Link>

          <nav className="site-nav">
            <Link href="/shop">All</Link>

            <div className="nav-drop">
              <span>Football ▾</span>
              <div className="nav-drop-menu">
                {NAV_FOOTBALL.map(l => (
                  <Link key={l.slug} href={`/category/${l.slug}`}>{l.name}</Link>
                ))}
              </div>
            </div>

            <div className="nav-drop">
              <span>US Sports ▾</span>
              <div className="nav-drop-menu">
                {NAV_US.map(l => (
                  <Link key={l.slug} href={`/category/${l.slug}`}>{l.name}</Link>
                ))}
              </div>
            </div>

            {NAV_OTHER.map(l => (
              <Link key={l.slug} href={`/category/${l.slug}`}>{l.name}</Link>
            ))}
          </nav>

          <div className="header-right">
            <Link href="/cart" className="icon-btn cart-btn">
              Cart <span className="cart-count" id="cart-count">0</span>
            </Link>
          </div>
        </header>

        {children}

        <footer>
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-logo">Krushy<em>Jersey</em></div>
                <p className="footer-tagline">More than just a jersey.</p>
              </div>
              <div className="footer-links">
                <Link href="/shop">Shop All</Link>
                <Link href="/category/retro-jerseys">Retro</Link>
                <Link href="/category/casual-clothing">Casual</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/refund">Refund Policy</Link>
              </div>
            </div>
            <p className="footer-copy">© 2026 KrushyJersey. All rights reserved.</p>
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var c = JSON.parse(localStorage.getItem('krushy_cart') || '[]');
            var el = document.getElementById('cart-count');
            if (el) el.textContent = c.reduce(function(a,b){return a+(b.qty||1);},0);
          } catch(e){}
        `}} />
      </body>
    </html>
  );
}
