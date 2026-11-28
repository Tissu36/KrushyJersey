import Link from "next/link";
import { getProducts } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const products = getProducts().slice(0, 48); // Loads 48 for performance

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Shop All</h1>
        <p>{products.length} items</p>
      </div>
      
      <div className="product-grid">
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </main>
  );
}
