import Link from "next/link";

export default function ProductCard({ product }) {
  const img = product.images && product.images[0] ? product.images[0] : null;
  const cleanImg = img ? img.replace(/^images\//, "") : null;
  const imgUrl = cleanImg ? "/images/images/" + cleanImg : null;

  return (
    <Link className="productCard" href={"/product/" + product.slug} prefetch={false}>
      <div className="productVisual" style={{ background: "#0f0f0f" }}>
        {imgUrl ? (
          <img src={imgUrl} alt={product.name} loading="lazy" width="300" height="400" />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#0f0f0f" }}></div>
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
