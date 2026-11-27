"use client";
import { useState } from "react";
import { productImageSrc } from "../lib/product-image";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});
  // In the imported catalogue the front/primary view is last; show it first.
  const galleryImages = [...(images || [])].filter(Boolean).reverse();
  const src = (img) => productImageSrc(img);
  const mainIndex = failed[active]
    ? galleryImages.findIndex((img, i) => i > active && !failed[i])
    : active;
  const mainImage = mainIndex >= 0 ? galleryImages[mainIndex] : null;

  return (
    <div className="pdp-gallery">
      <div className="pdp-main-img">
        {mainImage ? (
          <img src={src(mainImage)} alt={`${name} — view ${mainIndex + 1}`}
            onError={() => setFailed(f => ({ ...f, [mainIndex]: true }))} />
        ) : (
          <div className="img-placeholder" style={{ height: "100%" }}>
            <span className="ph-icon">👕</span><p className="ph-name">{name}</p>
          </div>
        )}
      </div>
      {galleryImages.length > 1 && (
        <div className="pdp-thumbs">
          {galleryImages.slice(0, 6).map((img, i) => (
            <button type="button" key={img} className={`pdp-thumb${active === i ? " active" : ""}`}
              onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`}>
              {!failed[i] ? <img src={src(img)} alt={`${name} ${i + 1}`}
                onError={() => setFailed(f => ({ ...f, [i]: true }))} /> : <span aria-hidden="true">👕</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
