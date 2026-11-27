"use client";
import Link from "next/link";
import { useState } from "react";
import { productImageSrc } from "../lib/product-image";

export default function ProductCard({ product }) {
  const [imageIndex, setImageIndex] = useState(0);
  // Legacy catalogue ordering: the full front shot is stored last.
  const candidates = (product.images || []).slice().reverse().map(productImageSrc).filter(Boolean);
  const src = candidates[imageIndex] || null;
  const price = (product.price * 1.1).toFixed(2);
  const cat = (product.categorySlug || product.category || "")
    .replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Link className="product-card" href={`/product/${product.slug}`} prefetch={false}>
      <div className="product-visual">
        {src
          ? <img src={src} alt={product.name} loading="lazy"
              onError={() => setImageIndex(i => i + 1)} />
          : <div className="img-placeholder"><span className="ph-icon">👕</span><p className="ph-name">{product.name}</p></div>
        }
      </div>
      <div className="product-info">
        <p className="product-category">{cat}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${price} CAD</p>
      </div>
    </Link>
  );
}
