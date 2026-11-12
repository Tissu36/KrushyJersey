"use client";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [failed, setFailed] = useState(false);
  const raw = product.images?.[0];
  const src = raw ? `/images/${raw.replace(/^images\//, "")}` : null;
  const price = (product.price * 1.1).toFixed(2);
  const catLabel = (product.category || product.categorySlug || "")
    .replace(/-/g, " ").toUpperCase();

  return (
    <Link className="product-card" href={`/product/${product.slug}`} prefetch={false}>
      <div className="product-visual">
        {src && !failed ? (
          <img
            src={src}
            alt={product.name}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="img-placeholder">
            <span className="ph-icon">👕</span>
            <p className="ph-name">{product.name}</p>
          </div>
        )}
      </div>
      <div className="product-info">
        <p className="product-category">{catLabel}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-foot">
          <span className="product-price">${price} CAD</span>
          <span className="product-view">View →</span>
        </div>
      </div>
    </Link>
  );
}
