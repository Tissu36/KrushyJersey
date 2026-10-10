import Link from "next/link";
import { getProducts } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";

const PER_PAGE = 48;

const CATEGORY_NAMES = {
  "national-team": "National Teams",
  "premier-league": "Premier League",
  "la-liga": "La Liga",
  "serie-a": "Serie A",
  "bundesliga": "Bundesliga",
  "ligue-1-mcdonalds": "Ligue 1 McDonald's",
  "brasileiro-serie-a": "Brasileiro Série A",
  "mexican-liga": "Mexican Liga",
  "other-american-asia": "Other American & Asia",
  "other-european": "Other European",
  "primeira-liga": "Primeira Liga",
  "scottish-premiership": "Scottish Premiership",
  "saudi-arabia-clubs": "Saudi Arabia Clubs",
  "turkey-austria": "Turkey & Austria",
  "retro-jerseys": "Retro Jerseys",
  "casual-clothing": "Casual Clothing",
  "jackets": "Jackets",
  "kits": "Kits",
  "mlb": "MLB",
  "nba": "NBA",
  "nfl": "NFL",
  "nhl": "NHL",
  "rugby": "Rugby",
  "f1": "F1",
  "mls": "MLS",
  "rma": "Real Madrid",
  "bar": "Barcelona",
  "psg": "Paris Saint-Germain",
  "ars": "Arsenal",
  "man-utd": "Manchester United",
  "man-city": "Manchester City",
  "liverpool": "Liverpool",
  "chelsea": "Chelsea",
  "tottenham": "Tottenham",
  "acm": "AC Milan",
  "int": "Inter Milan",
  "juv": "Juventus",
  "napoli": "Napoli",
  "roma": "Roma",
  "lazio": "Lazio",
  "atm": "Atlético Madrid",
  "real-betis": "Real Betis",
  "sevilla": "Sevilla",
  "villarreal": "Villarreal",
  "valencia": "Valencia",
  "bayern": "Bayern Munich",
  "dortmund": "Borussia Dortmund",
  "atlanta": "Atlanta United",
  "boca-juniors": "Boca Juniors",
  "river-plate": "River Plate",
  "flamengo": "Flamengo",
  "corinthians": "Corinthians",
  "santos": "Santos",
  "palmeiras": "Palmeiras",
  "chivas": "Chivas",
  "america": "Club América",
  "cruz-azul": "Cruz Azul",
};

const SUBCATS = [
  { key: "all",       label: "All",        tag: null },
  { key: "jersey",    label: "Jerseys",    tag: "jersey" },
  { key: "shorts",    label: "Shorts",     tag: "shorts" },
  { key: "tracksuit", label: "Tracksuits", tag: "tracksuit" },
  { key: "jacket",    label: "Jackets",    tag: "jacket" },
  { key: "retro",     label: "Retro",      tag: "retro" },
  { key: "kids",      label: "Kids",       tag: "kids" },
];

function yearOf(name) {
  const m = name.match(/^(19|20)\d{2}/);
  return m ? parseInt(m[0]) : -1;
}
function sortByYearDesc(list) {
  return [...list].sort((a, b) => {
    const ya = yearOf(a.name), yb = yearOf(b.name);
    if (ya === -1 && yb === -1) return a.name.localeCompare(b.name);
    if (ya === -1) return 1;
    if (yb === -1) return -1;
    return yb - ya;
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const sub = sp.sub || "all";
  const allProducts = getProducts();
  const all = allProducts.filter(p => (p.categories || [p.categorySlug]).includes(slug));
  if (all.length === 0) {
    return <main className="section"><h1>Category not found</h1><Link href="/shop" prefetch={false}>Back to shop</Link></main>;
  }
  const name = CATEGORY_NAMES[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const filter = SUBCATS.find(s => s.key === sub) || SUBCATS[0];
  const filtered = filter.tag
    ? sortByYearDesc(all.filter(p => (p.subtags || []).includes(filter.tag)))
    : sortByYearDesc(all);
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <main className="section">
      <p className="eyebrow"><Link href="/shop" prefetch={false}>Shop</Link> / {name}</p>
      <h1>{name} ({filtered.length})</h1>
      <div className="subFilters">
        {SUBCATS.map(s => {
          const count = s.tag
            ? all.filter(p => (p.subtags || []).includes(s.tag)).length
            : all.length;
          if (count === 0) return null;
          const active = s.key === sub;
          return (
            <Link
              key={s.key}
              className={active ? "subFilter active" : "subFilter"}
              href={`/category/${slug}?sub=${s.key}`}
              prefetch={false}
            >
              {s.label} ({count})
            </Link>
          );
        })}
      </div>
      <div className="productGrid">{slice.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      <div className="pagination">
        {page > 1 && <Link href={`/category/${slug}?sub=${sub}&page=${page - 1}`} prefetch={false}>← Prev</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/category/${slug}?sub=${sub}&page=${page + 1}`} prefetch={false}>Next →</Link>}
      </div>
    </main>
  );
}
