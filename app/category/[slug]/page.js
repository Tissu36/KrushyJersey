import Link from "next/link";
import { getProducts } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";

const PER_PAGE = 48;

const CAT_NAMES = {
  "premier-league":           "Premier League",
  "la-liga":                  "La Liga",
  "serie-a":                  "Serie A",
  "bundesliga":               "Bundesliga",
  "ligue-1-mcdonalds":        "Ligue 1",
  "retro-jerseys":            "Retro Jerseys",
  "casual-clothing":          "Casual Clothing",
  "mlb":                      "MLB",
  "nba":                      "NBA",
  "nfl":                      "NFL",
  "nhl":                      "NHL",
  "efl-championship-and-other":"EFL Championship",
  "mls":                      "MLS",
  "national-team":            "National Teams",
};

const TYPE_FILTERS = [
  { key: "all",       label: "All",       match: null        },
  { key: "jersey",    label: "Jerseys",   match: "jersey"    },
  { key: "shorts",    label: "Shorts",    match: "short"     },
  { key: "hoodie",    label: "Hoodies",   match: "hoodie"    },
  { key: "jacket",    label: "Jackets",   match: "jacket"    },
  { key: "tracksuit", label: "Tracksuits",match: "tracksuit" },
  { key: "kids",      label: "Kids",      match: "kid"       },
  { key: "retro",     label: "Retro",     match: "retro"     },
  { key: "player",    label: "Player Ver",match: "player"    },
];

function yearOf(name) { const m = name.match(/(20\d{2}|19\d{2})/); return m ? parseInt(m[0]) : 0; }

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp       = await searchParams;
  const page     = Math.max(1, parseInt(sp.page || "1"));
  const type     = sp.type || "all";
  const club     = sp.club || "all";

  // ── BUG FIX: filter by categorySlug OR by categories array ──
  let all = getProducts().filter(p =>
    p.categorySlug === slug ||
    (p.categories || []).includes(slug)
  );

  if (!all.length) return (
    <main className="section">
      <div className="empty-state">
        <h2>Category not found</h2>
        <Link href="/shop">← Back to shop</Link>
      </div>
    </main>
  );

  const name = CAT_NAMES[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  // Club list from categories field
  const clubSet = new Set();
  all.forEach(p => (p.categories || []).forEach(c => {
    if (c !== slug && !TYPE_FILTERS.some(t => t.match === c) && !["casual-clothing","retro-jerseys","jackets","kits","other"].includes(c))
      clubSet.add(c);
  }));
  const clubList = Array.from(clubSet).sort();

  // Apply filters
  if (type !== "all") {
    const f = TYPE_FILTERS.find(f => f.key === type);
    if (f?.match) all = all.filter(p => p.name.toLowerCase().includes(f.match));
  }
  if (club !== "all") all = all.filter(p => (p.categories || []).includes(club));
  all.sort((a, b) => yearOf(b.name) - yearOf(a.name));

  const total      = all.length;
  const totalPages = Math.ceil(total / PER_PAGE) || 1;
  const slice      = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (overrides) => {
    const base = { type, club, page: "1", ...overrides };
    const qs   = Object.entries(base).filter(([,v]) => v && v !== "all" && v !== "1").map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    return `/category/${slug}${qs ? "?" + qs : ""}`;
  };

  return (
    <main className="section">
      <p className="section-eyebrow">
        <Link href="/shop">Shop</Link> / {name}
      </p>
      <h1 className="page-title">{name} <span style={{ color:"var(--muted)", fontSize:"60%", fontFamily:"Inter,sans-serif", fontWeight:400 }}>({total.toLocaleString()})</span></h1>

      {/* Type filters */}
      <div className="chips" style={{ marginTop: 20 }}>
        {TYPE_FILTERS.map(f => (
          <Link key={f.key} href={href({ type: f.key, page: "1" })} className={`chip${type === f.key ? " active" : ""}`} prefetch={false}>
            {f.label}
          </Link>
        ))}
      </div>

      {/* Club filters */}
      {clubList.length > 0 && (
        <div className="chips">
          <Link href={href({ club: "all", page: "1" })} className={`chip${club === "all" ? " active" : ""}`} prefetch={false}>All Clubs</Link>
          {clubList.slice(0, 20).map(c => (
            <Link key={c} href={href({ club: c, page: "1" })} className={`chip${club === c ? " active" : ""}`} prefetch={false}>
              {c.replace(/-/g, " ").toUpperCase()}
            </Link>
          ))}
        </div>
      )}

      <div className="product-grid">
        {slice.map(p => <ProductCard key={p.slug} product={p} />)}
      </div>

      {slice.length === 0 && (
        <div className="empty-state">
          <h2>No jerseys found</h2>
          <p>Try a different filter.</p>
        </div>
      )}

      <div className="pagination">
        {page > 1          && <Link href={href({ page: String(page - 1) })} prefetch={false}>← Prev</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={href({ page: String(page + 1) })} prefetch={false}>Next →</Link>}
      </div>
    </main>
  );
}
