import './globals.css';
import Link from "next/link";
import { Search, User, ShoppingBag, Heart } from "lucide-react";

export const metadata = { title: 'KrushyJersey | Premium Sportswear' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Top Bar: Logo, Search, Icons */}
        <header className="top-header">
          <div className="top-header-inner">
            <Link href="/" className="nav-logo">
              KRUSHY<span>JERSEY</span>
            </Link>
            
            <div className="search-bar">
              <input type="text" placeholder="Search jerseys..." />
              <button><Search size={18} /></button>
            </div>

            <div className="header-icons">
              <Heart size={22} />
              <User size={22} />
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={22} />
                <span className="cart-badge">0</span>
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Bar: Categories */}
        <nav className="sub-nav">
          <div className="sub-nav-inner">
            <Link href="/shop">All Categories</Link>
            <Link href="/category/premier-league">Premier League</Link>
            <Link href="/category/la-liga">La Liga</Link>
            <Link href="/category/serie-a">Serie A</Link>
            <Link href="/category/national-team">National Teams</Link>
            <Link href="/category/retro-jerseys">Retro</Link>
            <Link href="/category/nba">NBA</Link>
            <Link href="/category/nfl">NFL</Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
