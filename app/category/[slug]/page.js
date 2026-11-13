import Link from "next/link";
import { getProducts } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";

const PER_PAGE = 48;

const CAT_NAMES = {
  "premier-league":              "Premier League",
  "la-liga":                     "La Liga",
  "serie-a":                     "Serie A",
  "bundesliga":                  "Bundesliga",
  "ligue-1-mcdonalds":           "Ligue 1",
  "retro-jerseys":               "Retro Jerseys",
  "casual-clothing":             "Casual Clothing",
  "mlb":                         "MLB",
  "nba":                         "NBA",
  "nfl":                         "NFL",
  "nhl":                         "NHL",
  "efl-championship-and-other":  "EFL Championship",
  "mls":                         "MLS",
  "national-team":               "National Teams",
};

// Each filter has an array of keywords — product name must include at least one
const TYPE_FILTERS = [
  { key: "all",       label: "All Items",          terms: [] },
  { key: "jersey",    label: "Jerseys",             terms: ["jersey"] },
  { key: "shorts",    label: "Shorts",              terms: ["short"] },
  { key: "jacket",    label: "Jackets & Windbreakers", terms: ["jacket", "windbreaker", "gilet"] },
  { key: "tracksuit", label: "Tracksuits & Sets",   terms: ["tracksuit", "track suit", "adult suit", "training suit", "pre-match"] },
  { key: "hoodie",    label: "Hoodies & Sweatshirts", terms: ["hoodie", "sweat", "sweatshirt", "fleece"] },
  { key: "polo",      label: "Polos & Tees",        terms: ["polo", " tee ", "t-shirt", "t shirt"] },
  { key: "kids",      label: "Kids & Youth",        terms: ["kid", "youth", "baby", "children", "junior", "infant"] },
  { key: "player",    label: "Player Version",      terms: ["player version", "player ver"] },
];

function matchesType(filter, nameLow) {
  if (!filter.terms.length) return true;
  return filter.terms.some(t => nameLow.includes(t));
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp       = await searchParams;
  const page     = Math.max(1, parseInt(sp.page || "1"));
  const type     = sp.type || "all";
  const club     = sp.club || "all";
  const q        = (sp.q || "").toLowerCase().trim();

  // Get all products for this category
  let base = getProducts().filter(p =>
    p.categorySlug === slug || (p.categories || []).includes(slug)
  );

  if (!base.length) return (
    <main>
      <div className="page-header">
        <p className="breadcrumb"><Link href="/shop">Shop</Link></p>
        <h1>Category not found</h1>
      </div>
    </main>
  );

  const name = CAT_NAMES[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // Build club list from categories
  const clubSet = new Set();
  base.forEach(p => (p.categories || []).forEach(c => {
    if (c !== slug &&
        !TYPE_FILTERS.some(f => f.terms.includes(c)) &&
        !["casual-clothing","retro-jerseys","jackets","kits","other","national-team"].includes(c))
      clubSet.add(c);
  }));
  const clubList = Array.from(clubSet).sort();

  // Count per type (for filter labels)
  const typeCounts = {};
  TYPE_FILTERS.forEach(f => {
    typeCounts[f.key] = f.key === "all"
      ? base.length
      : base.filter(p => matchesType(f, p.name.toLowerCase())).length;
  });

  // Count per club
  const clubCounts = {};
  clubList.forEach(c => {
    clubCounts[c] = base.filter(p => (p.categories || []).includes(c)).length;
  });

  // Apply filters
  let all = [...base];
  if (type !== "all") {
    const f = TYPE_FILTERS.find(f => f.key === type);
    if (f) all = all.filter(p => matchesType(f, p.name.toLowerCase()));
  }
  if (club !== "all") all = all.filter(p => (p.categories || []).includes(club));
  if (q) all = all.filter(p => p.name.toLowerCase().includes(q));

  // ── SORT: newest first by numeric ID ──
  all.sort((a, b) => parseInt(b.id) - parseInt(a.id));

  const total      = all.length;
  const totalPages = Math.ceil(total / PER_PAGE) || 1;
  const slice      = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (ov) => {
    const p = { type, club, q, page: "1", ...ov };
    const qs = Object.entries(p)
      .filter(([,v]) => v && v !== "all" && v !== "1" && v !== "")
      .map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    return `/category/${slug}${qs ? "?" + qs : ""}`;
  };

  const activeFilter = TYPE_FILTERS.find(f => f.key === type) || TYPE_FILTERS[0];

  return (
    <main>
      {/* Page header */}
      <div className="page-header">
        <p className="breadcrumb">
          <Link href="/shop">Shop</Link> / {name}
        </p>
        <h1>{name}</h1>
        <p>{total.toLocaleString()} items{type !== "all" ? ` — ${activeFilter.label}` : ""}{club !== "all" ? ` — ${club.replace(/-/g," ").toUpperCase()}` : ""}</p>
      </div>

      <div className="shop-layout" style={{ margin: "0 40px 60px", borderRadius: "var(--r)" }}>

        {/* Sidebar filters */}
        <aside className="shop-sidebar">

          {/* Search */}
          <div className="sidebar-section">
            <form method="get" action={`/category/${slug}`}>
              {type !== "all" && <input type="hidden" name="type" value={type} />}
              {club !== "all" && <input type="hidden" name="club" value={club} />}
              <div className="sidebar-search">
                <input name="q" defaultValue={sp.q || ""} placeholder="Search in category…" />
                <button type="submit">→</button>
              </div>
            </form>
          </div>

          {/* Type filter */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Item Type</div>
            {TYPE_FILTERS.filter(f => typeCounts[f.key] > 0 || f.key === "all").map(f => (
              <Link
                key={f.key}
                href={href({ type: f.key })}
                className={`filter-opt${type === f.key ? " active-acc" : ""}`}
                prefetch={false}
              >
                <span className="filter-opt-label">{f.label}</span>
                <span className="filter-opt-count">{typeCounts[f.key] || 0}</span>
              </Link>
            ))}
          </div>

          {/* Club filter */}
          {clubList.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-heading">Club</div>
              <Link href={href({ club: "all" })} className={`filter-opt${club === "all" ? " active-acc" : ""}`} prefetch={false}>
                <span className="filter-opt-label">All Clubs</span>
                <span className="filter-opt-count">{typeCounts[type] ?? total}</span>
              </Link>
              {clubList.slice(0, 30).map(c => (
                <Link
                  key={c}
                  href={href({ club: c })}
                  className={`filter-opt${club === c ? " active-acc" : ""}`}
                  prefetch={false}
                >
                  <span className="filter-opt-label">{c.replace(/-/g, " ").replace(/\b\w/g, x => x.toUpperCase())}</span>
                  <span className="filter-opt-count">{clubCounts[c] || 0}</span>
                </Link>
              ))}
            </div>
          )}
        </aside>

        {/* Main grid */}
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
              <h2>No items found</h2>
              <p>Try adjusting your filters.</p>
            </div>
          )}

          <div className="pagination">
            {page > 1          && <Link href={href({ page: String(page - 1) })} prefetch={false}>← Previous</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={href({ page: String(page + 1) })} prefetch={false}>Next →</Link>}
          </div>
        </div>
      </div>
    </main>
  );
}
