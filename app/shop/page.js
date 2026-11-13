import Link from "next/link";
import { getProducts } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

const PER_PAGE = 48;

const ALL_CATS = [
  { slug: "premier-league",          name: "Premier League" },
  { slug: "la-liga",                 name: "La Liga" },
  { slug: "bundesliga",              name: "Bundesliga" },
  { slug: "serie-a",                 name: "Serie A" },
  { slug: "ligue-1-mcdonalds",       name: "Ligue 1" },
  { slug: "national-team",           name: "National Teams" },
  { slug: "retro-jerseys",           name: "Retro Jerseys" },
  { slug: "nba",                     name: "NBA" },
  { slug: "nfl",                     name: "NFL" },
  { slug: "mlb",                     name: "MLB" },
  { slug: "nhl",                     name: "NHL" },
  { slug: "mls",                     name: "MLS" },
  { slug: "efl-championship-and-other", name: "EFL Championship" },
  { slug: "casual-clothing",         name: "Casual Clothing" },
];

export default async function Shop({ searchParams }) {
  const sp   = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const q    = (sp.q || "").toLowerCase().trim();
  const cat  = sp.cat || "";

  let all = getProducts();

  if (q) {
    all = all.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.categorySlug || "").replace(/-/g, " ").includes(q) ||
      (p.category || "").toLowerCase().replace(/-/g, " ").includes(q)
    );
  }
  if (cat) all = all.filter(p => p.categorySlug === cat || (p.categories || []).includes(cat));

  // Sort newest first
  all = [...all].sort((a, b) => parseInt(b.id) - parseInt(a.id));

  const total      = all.length;
  const totalPages = Math.ceil(total / PER_PAGE) || 1;
  const slice      = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (ov) => {
    const p = { q: sp.q || "", cat, page: "1", ...ov };
    const qs = Object.entries(p).filter(([,v]) => v && v !== "1").map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    return `/shop${qs ? "?" + qs : ""}`;
  };

  return (
    <main>
      <div className="page-header">
        <h1>Shop All</h1>
        <p>{total.toLocaleString()} jerseys{q ? ` matching "${sp.q}"` : ""}</p>
      </div>

      <div className="shop-layout" style={{ margin: "0 40px 60px", borderRadius: "var(--r)" }}>

        {/* Sidebar */}
        <aside className="shop-sidebar">
          <div className="sidebar-section">
            <form className="sidebar-search" method="get" action="/shop">
              {cat && <input type="hidden" name="cat" value={cat} />}
              <input name="q" defaultValue={sp.q || ""} placeholder="Search jerseys…" />
              <button type="submit">→</button>
            </form>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-heading">Category</div>
            <Link href="/shop" className={`filter-opt${!cat ? " active-acc" : ""}`} prefetch={false}>
              <span className="filter-opt-label">All Categories</span>
              <span className="filter-opt-count">{getProducts().length.toLocaleString()}</span>
            </Link>
            {ALL_CATS.map(c => (
              <Link
                key={c.slug}
                href={href({ cat: c.slug })}
                className={`filter-opt${cat === c.slug ? " active-acc" : ""}`}
                prefetch={false}
              >
                <span className="filter-opt-label">{c.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="shop-main">
          <div className="shop-main-head">
            <span className="shop-count">
              Showing <strong>{slice.length}</strong> of <strong>{total.toLocaleString()}</strong> — newest first
            </span>
          </div>
          <div className="product-grid">
            {slice.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
          {!slice.length && (
            <div className="empty-state">
              <h2>No results found</h2>
              <p>Try a different search or browse a category.</p>
            </div>
          )}
          <div className="pagination">
            {page > 1          && <Link href={href({ page: String(page-1) })} prefetch={false}>← Previous</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={href({ page: String(page+1) })} prefetch={false}>Next →</Link>}
          </div>
        </div>
      </div>
    </main>
  );
}
