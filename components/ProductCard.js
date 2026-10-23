import Link from "next/link";

export default function ProductCard({ product }) {
  const img = product.images && product.images[0] ? product.images[0] : null;
  const imgUrl = img ? (img.startsWith('images/') ? `/${img}` : `/images/images/${img}`) : null;

  return (
    <Link className="productCard" href={`/product/${product.slug}`} prefetch={false}>
      <div className="productVisual">
        {imgUrl ? (
          <img 
            src={imgUrl} 
            alt={product.name} 
            loading="lazy" 
            width="300" 
            height="400" 
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('jerseyMock'); e.target.parentNode.innerText = product.name; }}
          />
        ) : (
          <div className="jerseyMock">{product.name}</div>
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
