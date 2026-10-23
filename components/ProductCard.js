import Link from "next/link";

export default function ProductCard({ product }) {
  // If the image is a string, use it. If not, fail gracefully.
  let imgName = product.images && product.images[0] ? product.images[0] : null;
  
  // Clean up the name just in case the zip added 'images/' to the file name
  if (imgName && imgName.startsWith('images/')) {
    imgName = imgName.replace('images/', '');
  }

  const imgUrl = imgName ? `/images/${imgName}` : null;

  return (
    <Link className="productCard" href={`/product/${product.slug}`} prefetch={false}>
      <div className="productVisual">
        {imgUrl ? (
          <img src={imgUrl} alt={product.name} loading="lazy" width="300" height="400" />
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
