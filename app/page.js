import Link from "next/link";
import { getProducts } from "../lib/products";
import ProductCard from "../components/ProductCard";

const HERO_CATS = [
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
];

export default function Home() {
  const products = getProducts();
  const featured = products.slice(0, 12);
  return (
    <main>
      <section className="hero">
        <h1>Football Jerseys.<br/><em>Simple Prices.</em></h1>
        <p>16,000+ jerseys across every club, league and era.</p>
        <Link className="cta" href="#clubs" prefetch={false}>SHOP NOW</Link>
      </section>
      <section className="section" id="clubs">
        <h2>Shop by Category</h2>
        <div className="clubGrid">
          {HERO_CATS.map(c => (
            <Link key={c.slug} className="clubCard" href={`/category/${c.slug}`} prefetch={false}>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="sectionHeader">
          <h2>Featured Jerseys</h2>
          <Link href="/shop" prefetch={false}>See all →</Link>
        </div>
        <div className="productGrid">{featured.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      </section>
    </main>
  );
}
