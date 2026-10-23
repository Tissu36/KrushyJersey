import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "../../../lib/products";
import AddToCart from "../../../components/AddToCart";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const imgs = product.images || [];
  
  const getUrl = (img) => img.startsWith('images/') ? `/${img}` : `/images/images/${img}`;
  
  return (
    <main className="productPage">
      <div className="gallery">
        <div className="bigVisual">
          {imgs[0] ? <img src={getUrl(imgs[0])} alt={product.name} /> : <div className="jerseyMock">{product.name}</div>}
        </div>
        {imgs.length > 1 && (
          <div className="thumbs">
            {imgs.slice(0, 8).map((im, i) => (
              <img key={i} src={getUrl(im)} alt={`${product.name} ${i + 1}`} loading="lazy" />
            ))}
          </div>
        )}
      </div>
      <div className="productDetails">
        <p className="eyebrow"><Link href={`/category/${product.categorySlug}`}>{product.category}</Link></p>
        <h1>{product.name}</h1>
        <div className="price">${product.price.toFixed(2)} USD</div>
        <AddToCart product={product} />
      </div>
    </main>
  );
}
