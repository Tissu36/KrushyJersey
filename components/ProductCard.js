import Link from "next/link";

export default function ProductCard({ product }) {
  const img    = product.images && product.images[0] ? product.images[0] : null;
  const imgUrl = img ? `/images/${img.replace(/^images\//, "")}` : null;

  return (
    <Link className="productCard" href={"/product/" + product.slug} prefetch={false}>
      <div className="productVisual">
        {imgUrl
          ? <img src={imgUrl} alt={product.name} loading="lazy" />
          : <div className="jerseyMock">{product.name}</div>}
      </div>
      <div className="productInfo">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-quick-add">
          <div className="price">${product.price.toFixed(2)} CAD</div>
          <button className="quick-add-btn">View →</button>
        </div>
      </div>
    </Link>
  );
}
