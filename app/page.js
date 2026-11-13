import Link from "next/link";
import { getProducts } from "../lib/products";
import ProductCard from "../components/ProductCard";
import Intro from "../components/Intro";

const ALL_CATS = [
  { slug: "premier-league",          name: "Premier League",   count: "1,262" },
  { slug: "la-liga",                 name: "La Liga",          count: "1,593" },
  { slug: "national-team",           name: "National Teams",   count: "3,222" },
  { slug: "mlb",                     name: "MLB",              count: "1,283" },
  { slug: "nba",                     name: "NBA",              count: "959"   },
  { slug: "nfl",                     name: "NFL",              count: "851"   },
  { slug: "casual-clothing",         name: "Casual Clothing",  count: "1,227" },
  { slug: "serie-a",                 name: "Serie A",          count: "640"   },
  { slug: "retro-jerseys",           name: "Retro Jerseys",    count: "641"   },
  { slug: "bundesliga",              name: "Bundesliga",       count: "569"   },
  { slug: "nhl",                     name: "NHL",              count: "484"   },
  { slug: "ligue-1-mcdonalds",       name: "Ligue 1",          count: "495"   },
  { slug: "efl-championship-and-other", name: "EFL Championship", count: "230" },
  { slug: "mls",                     name: "MLS",              count: "196"   },
];

export default function Home() {
  const all       = getProducts();
  // Sort newest first by ID for homepage previews
  const sorted    = [...all].sort((a,b) => parseInt(b.id) - parseInt(a.id));
  const featured  = sorted.filter(p => p.categorySlug === "premier-league").slice(0, 4);
  const laLiga    = sorted.filter(p => p.categorySlug === "la-liga").slice(0, 4);
  const retro     = sorted.filter(p => p.categorySlug === "retro-jerseys").slice(0, 4);

  return (
    <main>
      <Intro />

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-label">16,000+ Jerseys in Stock</span>
          <h1>Rep Your<br /><span>Club.</span></h1>
          <p className="hero-sub">
            Authentic jerseys for every league, every club, every era.
            Fast worldwide delivery.
          </p>
          <Link href="/shop" className="hero-cta">Shop All Jerseys →</Link>
        </div>
      </section>

      {/* All categories */}
      <section className="section">
        <div className="section-top">
          <h2>All Categories</h2>
          <Link href="/shop" className="section-link">Browse all →</Link>
        </div>
        <div className="cat-grid">
          {ALL_CATS.map(c => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="cat-tile">
              <span className="cat-tile-name">{c.name}</span>
              <span className="cat-tile-count">{c.count} items</span>
              <span className="cat-tile-arr">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Premier League */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-top">
          <h2>Premier League — New In</h2>
          <Link href="/category/premier-league" className="section-link">See all →</Link>
        </div>
        <div className="product-grid" style={{ border: "1px solid var(--line)" }}>
          {featured.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* La Liga */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-top">
          <h2>La Liga — New In</h2>
          <Link href="/category/la-liga" className="section-link">See all →</Link>
        </div>
        <div className="product-grid" style={{ border: "1px solid var(--line)" }}>
          {laLiga.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Retro */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-top">
          <h2>Retro Jerseys</h2>
          <Link href="/category/retro-jerseys" className="section-link">See all →</Link>
        </div>
        <div className="product-grid" style={{ border: "1px solid var(--line)" }}>
          {retro.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Benefits */}
      <div className="benefits-row">
        {[
          { icon: "📦", title: "Fast Shipping",    desc: "Worldwide in 7–14 days. Free over $150 CAD." },
          { icon: "✅", title: "Quality Guarantee", desc: "Premium stitching — or your money back." },
          { icon: "🔐", title: "Secure Payment",    desc: "SSL encrypted. Powered by Stripe & Moneris." },
        ].map(b => (
          <div key={b.title} className="benefit-card">
            <div className="benefit-icon">{b.icon}</div>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
