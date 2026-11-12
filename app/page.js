import Link from "next/link";
import { getProducts } from "../lib/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const products = getProducts();
  const featured    = products.slice(0, 4);
  const newArrivals = products.slice(10, 14);
  const bestSellers = products.slice(50, 54);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orb" />
        <div className="hero-content">
          <p className="hero-kicker">Premium Sportswear</p>
          <h1>REP YOUR CLUB.<br /><em>IN STYLE.</em></h1>
          <p className="hero-sub">
            More than just a jersey. 16,000+ authentic kits across every league, delivered worldwide.
          </p>
          <div className="hero-badges">
            {["Premier League", "La Liga", "NBA", "NFL", "Retro"].map(b => (
              <span key={b} className="hero-badge">{b}</span>
            ))}
          </div>
          <Link className="cta" href="/shop">
            Shop Now <span className="cta-arrow">→</span>
          </Link>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          SCROLL
        </div>
      </section>

      {/* ── SHOP BY SPORT ── */}
      <section className="section">
        <p className="section-label">Browse</p>
        <h2>Shop by Sport</h2>
        <div className="clubGrid">
          {["Premier League","La Liga","NBA","NFL","MLB","Retro"].map(c => (
            <Link key={c} className="clubCard" href={`/shop?q=${c}`}>
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="section" style={{paddingTop:0}}>
        <div className="sectionHeader">
          <div>
            <p className="section-label">Hand-picked</p>
            <h2>Featured</h2>
          </div>
          <Link href="/shop">See all →</Link>
        </div>
        <div className="productGrid">
          {featured.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="section" style={{paddingTop:0}}>
        <div className="sectionHeader">
          <div>
            <p className="section-label">Just dropped</p>
            <h2>New Arrivals</h2>
          </div>
          <Link href="/shop">See all →</Link>
        </div>
        <div className="productGrid">
          {newArrivals.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="section" style={{paddingTop:0}}>
        <div className="sectionHeader">
          <div>
            <p className="section-label">Most popular</p>
            <h2>Best Sellers</h2>
          </div>
          <Link href="/shop">See all →</Link>
        </div>
        <div className="productGrid">
          {bestSellers.map(p => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="benefits">
        {[
          { icon: "🚀", title: "Fast Shipping",        desc: "Worldwide delivery in 7–14 days. Tracked from day one." },
          { icon: "🔒", title: "Secure Payment",       desc: "Encrypted checkout powered by Stripe & Moneris." },
          { icon: "⭐", title: "Quality Guarantee",    desc: "Premium stitching and fabric — or your money back." },
        ].map(b => (
          <div key={b.title} className="benefit">
            <div className="benefit-icon">{b.icon}</div>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
