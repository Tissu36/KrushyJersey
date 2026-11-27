"use client";
import Link from "next/link";
import { useState } from "react";
import { productImageSrc } from "../lib/product-image";

export default function ProductCard({ product }) {
  const images = (Array.isArray(product.images) ? product.images : [])
    .map(productImageSrc).filter(Boolean);
  const [imageIndex, setImageIndex] = useState(0);
  const src = images[imageIndex] || null;
  const price = (Number(product.price || 0) * 1.1).toFixed(2);
  const cat = (product.categorySlug || product.category || "")
    .replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Link className="product-card" href={`/product/${product.slug}`} prefetch={false}>
      <div className="product-visual">
        {src ? (
          <img
            src={src}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageIndex(i => i + 1)}
          />
        ) : (
          <div className="img-placeholder">
            <span className="ph-icon">👕</span>
            <p className="ph-name">{product.name}</p>
          </div>
        )}
      </div>
      <div className="product-info">
        <p className="product-category">{cat}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${price} CAD</p>
      </div>
    </Link>
  );
}
