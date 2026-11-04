import "./globals.css";
import Link from "next/link";
import { Search, User, ShoppingCart } from "lucide-react"; // We will add lucide-react next

export const metadata = {
  title: "KRUSHYJERSEY — MORE THAN JUST A JERSEY",
  description: "Premium football and sports jerseys. Rep your club in style.",
};

const NAV = [
  { slug: "premier-league", name: "Premier League" },
  { slug: "la-liga", name: "La Liga" },
  { slug: "bundesliga", name: "Bundesliga" },
  { slug: "serie-a", name: "Serie A" },
  { slug: "ligue-1-mcdonalds", name: "Ligue 1" },
  { slug: "mls", name: "MLS" },
  { slug: "national-team", name: "National Teams" },
  { slug: "retro-jerseys", name: "Retro Jerseys" },
  { slug: "nba", name: "NBA" },
  { slug: "nfl", name: "NFL" },
  { slug: "mlb", name: "MLB" },
  { slug: "nhl", name: "NHL" },
  { slug: "f1", name: "F1" },
  { slug: "rugby", name: "Rugby" },
  { slug: "casual-clothing", name: "Casual" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Announcement Bar */}
        <div className="announcement-bar">
          FREE SHIPPING ON ORDERS OVER $150 CAD • SHOP NOW
        </div>

        <header className="siteHeader">
          <Link className="logo" href="/">KRUSHY<span>JERSEY</span></Link>
          
          <nav>
            <Link href="/shop">Shop All</Link>
            {NAV.slice(0, 5).map(c => <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>)}
            <div className="nav-dropdown">
              <span>More</span>
              <div className="dropdown-content">
                {NAV.slice(5).map(c => <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>)}
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <button className="icon-btn"><Search size={18} /></button>
            <button className="icon-btn"><User size={18} /></button>
            <Link href="/cart" className="icon-btn cart-btn"><ShoppingCart size={18} /><span id="cart-count">0</span></Link>
          </div>
        </header>

        {children}
        
        <footer>
          <div className="footer-content">
            <div className="footer-brand">
              <h2>KRUSHYJERSEY</h2>
              <p>MORE THAN JUST A JERSEY.</p>
            </div>
            <div className="footer-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/refund">Refund Policy</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </div>
          <p className="copyright">© 2026 KrushyJersey. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
