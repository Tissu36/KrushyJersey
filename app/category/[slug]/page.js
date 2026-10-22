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

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const all = getProducts().filter(p => (p.categories || [p.categorySlug]).includes(slug));
  if (all.length === 0) {
    return <main className="section"><h1>Category not found</h1><Link href="/shop" prefetch={false}>Back to shop</Link></main>;
  }
  const name = CATEGORY_NAMES[slug] || slug.replace(/-/g, " ").toUpperCase();
  const totalPages = Math.ceil(all.length / PER_PAGE) || 1;
  const slice = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <main className="section">
      <p className="eyebrow"><Link href="/shop" prefetch={false}>Shop</Link> / {name}</p>
      <h1>{name} ({all.length})</h1>
      <div className="productGrid">{slice.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      <div className="pagination">
        {page > 1 && <Link href={`/category/${slug}?page=${page - 1}`} prefetch={false}>← Prev</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/category/${slug}?page=${page + 1}`} prefetch={false}>Next →</Link>}
      </div>
    </main>
  );
}
