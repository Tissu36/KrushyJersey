import Link from "next/link";
import { getProducts } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const products = getProducts().slice(0, 48); 

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Shop All</h1>
        <p>Showing 48 of 18,000+ jerseys</p>
      </div>
      
      <div className="product-grid">
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </main>
  );
}
