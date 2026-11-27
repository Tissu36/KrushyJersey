"use client";
import { useState } from "react";
import { productImageSrc } from "../lib/product-image";

export default function ProductGallery({ images, name }) {
  const galleryImages = (Array.isArray(images) ? images : [])
    .map(productImageSrc).filter(Boolean);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});
  const firstAvailable = galleryImages.findIndex((_, i) => !failed[i]);
  const mainIndex = failed[active] ? firstAvailable : active;
  const mainImage = mainIndex >= 0 ? galleryImages[mainIndex] : null;

  return (
    <div className="pdp-gallery">
      <div className="pdp-main-img">
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${name} — view ${mainIndex + 1}`}
            decoding="async"
            onError={() => setFailed(f => ({ ...f, [mainIndex]: true }))}
          />
        ) : (
          <div className="img-placeholder" style={{ height: "100%" }}>
            <span className="ph-icon">👕</span>
            <p className="ph-name">{name}</p>
          </div>
        )}
      </div>
      {galleryImages.length > 1 && (
        <div className="pdp-thumbs">
          {galleryImages.slice(0, 6).map((src, i) => (
            <button
              type="button"
              key={src + i}
              className={`pdp-thumb${active === i ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
            >
              {!failed[i]
                ? <img src={src} alt={`${name} ${i + 1}`} loading="lazy" onError={() => setFailed(f => ({ ...f, [i]: true }))} />
                : <span aria-hidden="true">👕</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
