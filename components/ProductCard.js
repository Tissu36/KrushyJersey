import Link from "next/link";
import { Heart } from "lucide-react";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const price = (parseFloat(product.price) * 1.10).toFixed(2);
  const rawImg = product.images && product.images.length > 0 ? product.images[0] : null;
  
  // Never use a local placeholder (which might be Pele). Use a clean dark text placeholder.
  const imgSrc = rawImg 
    ? (rawImg.startsWith('/') ? rawImg : `/images/${rawImg}`) 
    : "https://placehold.co/600x800/111114/8B5CF6?text=KrushyJersey";

  return (
    <div className="card">
      <div className="card-img-wrap">
        <Link href={`/product/${product.slug}`}>
          <ProductImage src={imgSrc} alt={product.name} />
        </Link>
        {product.customizable && <span className="card-badge">NEW</span>}
        <button className="card-heart"><Heart size={14} /></button>
      </div>
      <Link href={`/product/${product.slug}`}>
        <h3 className="card-title">{product.name}</h3>
      </Link>
      <div className="card-price-row">
        <span className="card-price">${price} CAD</span>
      </div>
    </div>
  );
}
