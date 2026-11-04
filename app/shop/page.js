import Link from "next/link";
import { getProducts } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

const PER_PAGE = 48;

export default async function Shop({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const q = (params.q || "").toLowerCase();
  
  let all = getProducts();

  // Filter logic
  if (q) {
    all = all.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (params.version === "player") all = all.filter(p => p.name.toLowerCase().includes("player"));
  if (params.version === "fan") all = all.filter(p => p.name.toLowerCase().includes("fans"));

  const total = all.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const slice = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="section">
      <h1>SHOP ALL ({total})</h1>
      
      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="filters">
          <h3>FILTERS</h3>
          <form method="get" className="searchBar">
            <input name="q" defaultValue={params.q || ""} placeholder="Search jerseys..." />
            <button type="submit">→</button>
          </form>

          <div className="filter-group">
            <h4>Version</h4>
            <Link href={`/shop?version=player${q ? "&q="+q : ""}`} className={params.version === "player" ? "active-filter" : ""}>Player Version</Link>
            <Link href={`/shop?version=fan${q ? "&q="+q : ""}`} className={params.version === "fan" ? "active-filter" : ""}>Fan Version</Link>
            <Link href={`/shop${q ? "?q="+q : ""}`}>Clear</Link>
          </div>

          <div className="filter-group">
            <h4>Price</h4>
            <Link href={`/shop?max=50${q ? "&q="+q : ""}`}>Under $50 CAD</Link>
            <Link href={`/shop?min=50&max=100${q ? "&q="+q : ""}`}>$50 - $100 CAD</Link>
            <Link href={`/shop?min=100${q ? "&q="+q : ""}`}>Over $100 CAD</Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="shop-grid">
          <div className="productGrid">
            {slice.map(p => <ProductCard key={p.slug} product={p} />)}
          </div>
          <div className="pagination">
            {page > 1 && <Link href={`/shop?page=${page - 1}${q ? "&q=" + q : ""}`}>← Prev</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/shop?page=${page + 1}${q ? "&q=" + q : ""}`}>Next →</Link>}
          </div>
        </div>
      </div>
    </main>
  );
}
