import Link from "next/link";
import { getProducts } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

const PER_PAGE = 48;

export default async function Shop({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const q = (params.q || "").toLowerCase();
  let all = getProducts();
  if (q) all = all.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  const total = all.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const slice = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return (
    <main className="section">
      <h1>Shop All ({total})</h1>
      <form method="get" className="searchBar">
        <input name="q" defaultValue={params.q || ""} placeholder="Search jerseys..." />
        <button type="submit">Search</button>
      </form>
      <div className="productGrid">{slice.map(p => <ProductCard key={p.slug} product={p} />)}</div>
      <div className="pagination">
        {page > 1 && <Link href={`/shop?page=${page - 1}${q ? "&q=" + q : ""}`} prefetch={false}>← Prev</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/shop?page=${page + 1}${q ? "&q=" + q : ""}`} prefetch={false}>Next →</Link>}
      </div>
    </main>
  );
}
