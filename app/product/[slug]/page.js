import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "../../../lib/products";
import AddToCart from "../../../components/AddToCart";
import ProductGallery from "../../../components/ProductGallery";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const imgs = product.images || [];
  
  return (
    <main className="productPage">
      <ProductGallery images={imgs} name={product.name} />
      <div className="productDetails">
        <p className="eyebrow"><Link href={`/category/${product.categorySlug}`}>{product.category}</Link></p>
        <h1>{product.name}</h1>
        <div className="price">${product.price.toFixed(2)} USD</div>
        <AddToCart product={product} />
      </div>
    </main>
  );
}
