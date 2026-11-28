import './globals.css';
import Link from "next/link";
import { Search, User, ShoppingBag, Heart } from "lucide-react";

export const metadata = { title: 'KrushyJersey | Premium Sportswear' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="top-header">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">KRUSHY<span>JERSEY</span></Link>
            <div className="header-icons">
              <Search size={20} />
              <User size={20} />
              <Heart size={20} />
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={20} />
                <span className="cart-badge">0</span>
              </div>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
