import Link from "next/link";
import { getProducts } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

const PER_PAGE = 48;

const CATEGORIES = [
  { slug: "premier-league",       name: "Premier League" },
  { slug: "la-liga",              name: "La Liga" },
  { slug: "bundesliga",           name: "Bundesliga" },
  { slug: "serie-a",              name: "Serie A" },
  { slug: "ligue-1-mcdonalds",    name: "Ligue 1" },
  { slug: "national-team",        name: "National Teams" },
  { slug: "retro-jerseys",        name: "Retro Jerseys" },
  { slug: "nba",                  name: "NBA" },
  { slug: "nfl",                  name: "NFL" },
  { slug: "mlb",                  name: "MLB" },
  { slug: "nhl",                  name: "NHL" },
  { slug: "mls",                  name: "MLS" },
  { slug: "casual-clothing",      name: "Casual Clothing" },
  { slug: "efl-championship-and-other", name: "EFL Championship" },
];

export default async function Shop({ searchParams }) {
  const sp   = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const q    = (sp.q || "").toLowerCase().trim();
  const cat  = sp.cat || "";

  let all = getProducts();

  // ── BUG FIX: search by name AND by categorySlug/category display name ──
  if (q) {
    all = all.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.categorySlug || "").includes(q) ||
      (p.category || "").toLowerCase().replace(/-/g, " ").includes(q)
    );
  }
  if (cat) {
    all = all.filter(p =>
      (p.categories || [p.categorySlug]).includes(cat)
    );
  }
  if (sp.version === "player") all = all.filter(p => p.name.toLowerCase().includes("player"));
  if (sp.version === "fan")    all = all.filter(p => p.name.toLowerCase().includes("fans"));

  const total      = all.length;
  const totalPages = Math.ceil(total / PER_PAGE) || 1;
  const slice      = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const buildHref = (overrides) => {
    const params = new URLSearchParams();
    if (q)             params.set("q",    sp.q || "");
    if (cat)           params.set("cat",  cat);
    if (sp.version)    params.set("version", sp.version);
    Object.entries(overrides).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    return `/shop?${params.toString()}`;
  };

  return (
    <main className="section">
      <p className="section-eyebrow">Browse</p>
      <h1 className="page-title">Shop All — {total.toLocaleString()} jerseys</h1>

      <div className="shop-wrap" style={{ marginTop: 32 }}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Filters</div>

          <form className="search-bar" method="get" action="/shop">
            <input name="q" defaultValue={sp.q || ""} placeholder="Search jerseys…" />
            {cat && <input type="hidden" name="cat" value={cat} />}
            <button type="submit">→</button>
          </form>

          <div className="filter-group">
            <div className="filter-group-title">League / Sport</div>
            <Link href="/shop" className={!cat ? "active-f" : ""}>All</Link>
            {CATEGORIES.map(c => (
              <Link
                key={c.slug}
                href={buildHref({ cat: c.slug, page: "" })}
                className={cat === c.slug ? "active-f" : ""}
                prefetch={false}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-group-title">Version</div>
            <Link href={buildHref({ version: "player", page: "" })} className={sp.version === "player" ? "active-f" : ""} prefetch={false}>Player Version</Link>
            <Link href={buildHref({ version: "fan",    page: "" })} className={sp.version === "fan"    ? "active-f" : ""} prefetch={false}>Fan Version</Link>
            {sp.version && <Link href={buildHref({ version: "", page: "" })} prefetch={false}>✕ Clear</Link>}
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="product-grid">
            {slice.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
          {slice.length === 0 && (
            <div className="empty-state">
              <h2>No jerseys found</h2>
              <p>Try a different search or browse a category.</p>
            </div>
          )}
          <div className="pagination">
            {page > 1       && <Link href={buildHref({ page: String(page - 1) })} prefetch={false}>← Prev</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={buildHref({ page: String(page + 1) })} prefetch={false}>Next →</Link>}
          </div>
        </div>
      </div>
    </main>
  );
}
