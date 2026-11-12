import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "../../../lib/products";
import AddToCart from "../../../components/AddToCart";
import ProductGallery from "../../../components/ProductGallery";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product  = getProduct(slug);
  if (!product) notFound();

  const imgs  = product.images || [];
  const price = (product.price * 1.1).toFixed(2);
  const cat   = product.categorySlug || product.category || "";
  const catName = cat.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <main className="pdp">
      {/* Gallery — interactive client component */}
      <ProductGallery images={imgs} name={product.name} />

      {/* Info */}
      <div className="pdp-info">
        <p className="pdp-breadcrumb">
          <Link href="/shop">Shop</Link> /{" "}
          <Link href={`/category/${cat}`}>{catName}</Link>
        </p>
        <h1 className="pdp-name">{product.name}</h1>
        <div className="pdp-price">${price} CAD</div>
        <p className="pdp-availability">In Stock — Ships in 7–14 days</p>
        <AddToCart product={product} />
      </div>
    </main>
  );
}
