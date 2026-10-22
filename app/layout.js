import "./globals.css";
import Link from "next/link";
import Intro from "../components/Intro";

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
  { slug: "efl-championship-and-other", name: "EFL" },
  { slug: "mls", name: "MLS" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Intro />
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
          <p>Clean jerseys. Simple prices.</p>
          <p className="muted">Product availability, supplier stock and shipping times are confirmed before fulfillment.</p>
        </footer>
      </body>
    </html>
  );
}
