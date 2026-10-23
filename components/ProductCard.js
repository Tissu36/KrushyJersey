import Link from "next/link";

export default function ProductCard({ product }) {
  // If there are no images left after the cleanup, show a black box
  const hasImg = product.images && product.images.length > 0;
  const imgUrl = hasImg ? (product.images[0].startsWith('images/') ? `/${product.images[0]}` : `/images/${product.images[0]}`) : null;

  return (
    <Link className="productCard" href={`/product/${product.slug}`} prefetch={false}>
      <div className="productVisual">
        {hasImg ? (
          <img 
            src={imgUrl} 
            alt={product.name} 
            loading="lazy" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '10px' }}>
            NO IMAGE
          </div>
        )}
      </div>
      <div className="productInfo">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="price">${product.price.toFixed(2)} USD</div>
      </div>
    </Link>
  );
}
