import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "../../../lib/products";
import AddToCart from "../../../components/AddToCart";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const imgs = product.images || [];

  return (
    <main className="productPage">
      <div className="gallery">
        <div className="bigVisual">
          {imgs[0] ? <img src={`/images/${imgs[0].replace(/^images\//, "")}`} alt={product.name} /> : <div className="jerseyMock">{product.name}</div>}
        </div>
        {imgs.length > 1 && (
          <div className="thumbs">
            {imgs.slice(0, 4).map((im, i) => (
              <img key={i} src={`/images/${im.replace(/^images\//, "")}`} alt={`${product.name} ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
      
      <div className="productDetails">
        <p className="eyebrow"><Link href={`/category/${product.categorySlug}`}>{product.category}</Link></p>
        <h1>{product.name}</h1>
        <div className="price">${product.price.toFixed(2)} CAD</div>
        <p className="availability">✓ In Stock — Ships in 7-14 days</p>
        <p className="description">Premium quality football jersey. Breathable, moisture-wicking fabric. Perfect for match day or everyday wear.</p>
        <AddToCart product={product} />
      </div>
    </main>
  );
}
