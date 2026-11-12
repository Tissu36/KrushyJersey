import Link from "next/link";
import { getProducts } from "../lib/products";
import ProductCard from "../components/ProductCard";
import Intro from "../components/Intro";

const SPORTS = [
  { slug: "premier-league",    name: "Premier League",  emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", count: "1,262+" },
  { slug: "la-liga",           name: "La Liga",         emoji: "🇪🇸", count: "1,593+" },
  { slug: "bundesliga",        name: "Bundesliga",      emoji: "🇩🇪", count: "569+"   },
  { slug: "serie-a",           name: "Serie A",         emoji: "🇮🇹", count: "640+"   },
  { slug: "ligue-1-mcdonalds", name: "Ligue 1",         emoji: "🇫🇷", count: "495+"   },
  { slug: "nba",               name: "NBA",             emoji: "🏀", count: "959+"   },
  { slug: "nfl",               name: "NFL",             emoji: "🏈", count: "851+"   },
  { slug: "national-team",     name: "National Teams",  emoji: "🌍", count: "3,222+" },
  { slug: "retro-jerseys",     name: "Retro Jerseys",   emoji: "⏳", count: "641+"   },
  { slug: "mlb",               name: "MLB",             emoji: "⚾", count: "1,283+" },
  { slug: "nhl",               name: "NHL",             emoji: "🏒", count: "484+"   },
  { slug: "mls",               name: "MLS",             emoji: "⚽", count: "196+"   },
];

export default function Home() {
  const all       = getProducts();
  const featured  = all.filter(p => p.categorySlug === "premier-league").slice(0, 4);
  const newDrop   = all.filter(p => p.categorySlug === "la-liga").slice(0, 4);
  const retro     = all.filter(p => p.categorySlug === "retro-jerseys").slice(0, 4);

  return (
    <main>
      <Intro />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-orb" />
        <div className="hero-content">
          <div className="hero-pill">New Drops Every Week</div>
          <h1>
            REP YOUR<br />
            <span className="grad">CLUB.</span>
          </h1>
          <p className="hero-sub">16,000+ authentic jerseys across every league, team and era. Delivered worldwide.</p>
          <div className="hero-tags">
            {["Premier League", "La Liga", "NBA", "NFL", "Retro", "National Teams"].map(t => (
              <span key={t} className="hero-tag">{t}</span>
            ))}
          </div>
          <Link href="/shop" className="hero-cta">
            Shop All Jerseys <span className="hero-arrow">→</span>
          </Link>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          SCROLL
        </div>
      </section>

      {/* ── SHOP BY SPORT ── */}
      <section className="section">
        <p className="section-eyebrow">Browse</p>
        <div className="section-head">
          <h2>Shop by League</h2>
          <Link href="/shop" className="section-link">All categories →</Link>
        </div>
        <div className="sport-grid">
          {SPORTS.map(s => (
            <Link key={s.slug} href={`/category/${s.slug}`} className="sport-card">
              <span className="sport-emoji">{s.emoji}</span>
              <span className="sport-name">{s.name}</span>
              <span className="sport-count">{s.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PREMIER LEAGUE ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <p className="section-eyebrow">England</p>
        <div className="section-head">
          <h2>Premier League</h2>
          <Link href="/category/premier-league" className="section-link">See all →</Link>
        </div>
        <div className="product-grid">
          {featured.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── LA LIGA ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <p className="section-eyebrow">Spain</p>
        <div className="section-head">
          <h2>La Liga</h2>
          <Link href="/category/la-liga" className="section-link">See all →</Link>
        </div>
        <div className="product-grid">
          {newDrop.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── RETRO ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <p className="section-eyebrow">Classic</p>
        <div className="section-head">
          <h2>Retro Jerseys</h2>
          <Link href="/category/retro-jerseys" className="section-link">See all →</Link>
        </div>
        <div className="product-grid">
          {retro.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <div className="benefits-row">
        {[
          { icon: "🚀", title: "Fast Worldwide Shipping",   desc: "Tracked delivery in 7–14 business days. Free on orders over $150 CAD." },
          { icon: "⭐", title: "Premium Quality Guarantee", desc: "Professional-grade stitching and breathable fabric — or your money back." },
          { icon: "🔒", title: "Secure Payment",            desc: "SSL-encrypted checkout with Stripe & Moneris. Your data is always safe." },
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
