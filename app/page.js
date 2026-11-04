import Link from "next/link";
import { getProducts } from "../lib/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const products = getProducts();
  const featured = products.slice(0, 4);
  const newArrivals = products.slice(10, 14);
  const bestSellers = products.slice(50, 54);

  return (
    <main>
      {/* Cinematic Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">PREMIUM SPORTSWEAR</p>
          <h1>REP YOUR CLUB.<br/><em>IN STYLE.</em></h1>
          <p className="hero-sub">MORE THAN JUST A JERSEY. 16,000+ authentic kits across every league.</p>
          <Link className="cta" href="/shop">SHOP NOW</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2>SHOP BY SPORT</h2>
        <div className="clubGrid">
          {["Premier League", "La Liga", "NBA", "NFL", "MLB", "Retro"].map(c => (
            <Link key={c} className="clubCard" href={`/shop?q=${c}`}>
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="sectionHeader">
          <h2>FEATURED</h2>
          <Link href="/shop">See all →</Link>
        </div>
        <div className="productGrid">{featured.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="sectionHeader">
          <h2>NEW ARRIVALS</h2>
          <Link href="/shop">See all →</Link>
        </div>
        <div className="productGrid">{newArrivals.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <div className="sectionHeader">
          <h2>BEST SELLERS</h2>
          <Link href="/shop">See all →</Link>
        </div>
        <div className="productGrid">{bestSellers.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      {/* Benefits */}
      <section className="section benefits">
        <div className="benefit">
          <h3>FAST SHIPPING</h3>
          <p>Worldwide delivery in 7-14 days.</p>
        </div>
        <div className="benefit">
          <h3>SECURE PAYMENT</h3>
          <p>Encrypted checkout with Stripe/Moneris.</p>
        </div>
        <div className="benefit">
          <h3>QUALITY GUARANTEE</h3>
          <p>Premium stitching and fabric.</p>
        </div>
      </section>
    </main>
  );
}
