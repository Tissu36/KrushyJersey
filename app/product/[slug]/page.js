import Link from "next/link";
import { getProduct } from "../../../lib/products";
import ProductImage from "../../../components/ProductImage";
import ProductClientUI from "./ProductClientUI";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return <main style={{ padding: '50px', textAlign: 'center' }}><h1>Product not found</h1><Link href="/shop" style={{ color: 'var(--accent)' }}>Go back to shop</Link></main>;
  }

  // Handle images (Main + Thumbnails)
  const images = product.images || [];
  const mainImg = images.length > 0 ? (images[0].startsWith('/') ? images[0] : `/images/${images[0]}`) : "/placeholder.png";
  const price = (parseFloat(product.price) * 1.10).toFixed(2);

  return (
    <main className="product-page">
      
      {/* Left Side: Image Gallery */}
      <div className="product-gallery">
        <div className="thumbnail-list">
           {images.slice(0, 5).map((img, i) => {
             const src = img.startsWith('/') ? img : `/images/${img}`;
             return <ProductImage key={i} src={src} alt={`thumb-${i}`} className="thumbnail" />;
           })}
        </div>
        <div className="main-image">
           <ProductImage src={mainImg} alt={product.name} />
        </div>
      </div>

      {/* Right Side: Details & Buying UI */}
      <div className="product-details">
        <h1>{product.name}</h1>
        <p className="item-no">Item NO: {product.id}</p>
        <p className="price">${price} CAD</p>
        
        {/* Interactive Client Component (Sizes, Customization, Cart) */}
        <ProductClientUI product={product} price={price} />
        
        {/* Details Section */}
        <div className="product-meta">
          <h3>Details</h3>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Shipping:</strong> Worldwide Delivery (7-14 days)</p>
          <p><strong>Quality:</strong> Premium Fan/Player Version</p>
        </div>
      </div>
    </main>
  );
}
