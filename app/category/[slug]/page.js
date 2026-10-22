import Link from "next/link";
import { getProducts } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";

const PER_PAGE = 48;
const CATEGORY_NAMES = {
  "national-team": "National Teams", "premier-league": "Premier League",
  "la-liga": "La Liga", "serie-a": "Serie A", "bundesliga": "Bundesliga",
  "ligue-1-mcdonalds": "Ligue 1 McDonald's", "brasileiro-serie-a": "Brasileiro Série A",
  "mexican-liga": "Mexican Liga", "retro-jerseys": "Retro Jerseys",
  "casual-clothing": "Casual Clothing", "mlb": "MLB", "nba": "NBA", "nfl": "NFL", "nhl": "NHL",
  "efl-championship-and-other": "EFL Championship", "mls": "MLS"
};

const TYPE_FILTERS = [
  { key: "all", label: "All", match: null },
  { key: "jersey", label: "Jerseys", match: "jersey" },
  { key: "shorts", label: "Shorts", match: "short" },
  { key: "hoodie", label: "Hoodies", match: "hoodie" },
  { key: "jacket", label: "Jackets", match: "jacket" },
  { key: "tracksuit", label: "Tracksuits", match: "tracksuit" },
  { key: "kids", label: "Kids / Baby", match: "kid" },
  { key: "retro", label: "Retro", match: "retro" },
];

function getYear(name) {
  const m = name.match(/(20\d{2}|19\d{2})/);
  return m ? parseInt(m[0]) : 0;
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  
  const page = Math.max(1, parseInt(sp.page || "1"));
  const type = sp.type || "all";
  const club = sp.club || "all";
  
  let all = getProducts().filter(p => (p.categories || [p.categorySlug]).includes(slug));
  
  if (all.length === 0) {
    return <main className="section"><h1>Category not found</h1><Link href="/shop" prefetch={false}>Back to shop</Link></main>;
  }

  const name = CATEGORY_NAMES[slug] || slug.replace(/-/g, " ").toUpperCase();

  const availableClubs = new Set();
  all.forEach(p => {
    if (p.categories && p.categories.length > 1) {
      p.categories.forEach(c => {
        if (c !== slug && !TYPE_FILTERS.some(t => t.match === c)) {
          availableClubs.add(c);
        }
      });
    }
  });
  const clubList = Array.from(availableClubs).sort();

  if (type !== "all") {
    const filter = TYPE_FILTERS.find(f => f.key === type);
    if (filter && filter.match) {
      all = all.filter(p => p.name.toLowerCase().includes(filter.match));
    }
  }

  if (club !== "all") {
    all = all.filter(p => (p.categories || []).includes(club));
  }

  all.sort((a, b) => getYear(b.name) - getYear(a.name));

  const totalPages = Math.ceil(all.length / PER_PAGE) || 1;
  const slice = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="section">
      <p className="eyebrow"><Link href="/shop" prefetch={false}>Shop</Link> / {name}</p>
      <h1>{name} ({all.length})</h1>
      
      <div className="subFilters" style={{ marginBottom: '16px' }}>
        {TYPE_FILTERS.map(f => (
          <Link 
            key={f.key} 
            className={type === f.key ? "subFilter active" : "subFilter"} 
            href={`/category/${slug}?type=${f.key}&club=${club}`} 
            prefetch={false}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {clubList.length > 0 && (
        <div className="subFilters" style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', marginRight: '10px', letterSpacing: '1px', textTransform: 'uppercase', alignSelf: 'center' }}>Clubs:</span>
          <Link href={`/category/${slug}?type=${type}&club=all`} prefetch={false} className={club === "all" ? "subFilter active" : "subFilter"}>All Clubs</Link>
          {clubList.map(c => (
            <Link key={c} href={`/category/${slug}?type=${type}&club=${c}`} prefetch={false} className={club === c ? "subFilter active" : "subFilter"}>
              {c.replace(/-/g, ' ').toUpperCase()}
            </Link>
          ))}
        </div>
      )}

      <div className="productGrid">{slice.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      
      <div className="pagination">
        {page > 1 && <Link href={`/category/${slug}?type=${type}&club=${club}&page=${page - 1}`} prefetch={false}>← Prev</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/category/${slug}?type=${type}&club=${club}&page=${page + 1}`} prefetch={false}>Next →</Link>}
      </div>
    </main>
  );
}
