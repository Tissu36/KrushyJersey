import Link from "next/link";
import { getProductsByCategory } from "../../../lib/products";
import ProductCard from "../../../components/ProductCard";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const products = getProductsByCategory(slug);
  
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>{title}</h1>
        <p>{products.length} items</p>
      </div>
      
      <div className="product-grid">
        {products.slice(0, 48).map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </main>
  );
}
