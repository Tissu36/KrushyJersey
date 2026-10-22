import Link from "next/link";
import { getProducts } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";

const PER_PAGE = 48;
const CATEGORY_NAMES = {
  "national-team": "National Teams", "premier-league": "Premier League",
  "la-liga": "La Liga", "serie-a": "Serie A", "bundesliga": "Bundesliga",
  "ligue-1-mcdonalds": "Ligue 1 McDonald's", "brasileiro-serie-a": "Brasileiro Série A",
  "mexican-liga": "Mexican Liga", "retro-jerseys": "Retro Jerseys",
  "casual-clothing": "Casual Clothing", "mlb": "MLB", "nba": "NBA", "nfl": "NFL", "nhl": "NHL"
};

const CASUAL_SUBFILTERS = [
  { key: "all", label: "All" },
  { key: "hoodie", label: "Hoodies", match: "hoodie" },
  { key: "jacket", label: "Jackets", match: "jacket" },
  { key: "shirt", label: "Shirts", match: "shirt" },
  { key: "tracksuit", label: "Tracksuits", match: "tracksuit" },
  { key: "shorts", label: "Shorts", match: "short" },
];

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const sub = sp.sub || "all";
  
  let all = getProducts().filter(p => (p.categories || [p.categorySlug]).includes(slug));
  
  if (all.length === 0) {
    return <main className="section"><h1>Category not found</h1><Link href="/shop" prefetch={false}>Back to shop</Link></main>;
  }

  const name = CATEGORY_NAMES[slug] || slug.replace(/-/g, " ").toUpperCase();

  // If we are on the Casual page, apply the sub-filters
  if (slug === "casual-clothing" && sub !== "all") {
    const filter = CASUAL_SUBFILTERS.find(f => f.key === sub);
    if (filter && filter.match) {
      all = all.filter(p => p.name.toLowerCase().includes(filter.match));
    }
  }

  const totalPages = Math.ceil(all.length / PER_PAGE) || 1;
  const slice = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="section">
      <p className="eyebrow"><Link href="/shop" prefetch={false}>Shop</Link> / {name}</p>
      <h1>{name} ({all.length})</h1>
      
      {slug === "casual-clothing" && (
        <div className="subFilters">
          {CASUAL_SUBFILTERS.map(f => (
            <Link 
              key={f.key} 
              className={sub === f.key ? "subFilter active" : "subFilter"} 
              href={`/category/${slug}?sub=${f.key}`} 
              prefetch={false}
            >
              {f.label}
            </Link>
          ))}
        </div>
      )}

      <div className="productGrid">{slice.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      <div className="pagination">
        {page > 1 && <Link href={`/category/${slug}?sub=${sub}&page=${page - 1}`} prefetch={false}>← Prev</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/category/${slug}?sub=${sub}&page=${page + 1}`} prefetch={false}>Next →</Link>}
      </div>
    </main>
  );
}
