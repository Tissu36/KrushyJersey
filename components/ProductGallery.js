"use client";
import { useState } from "react";
import { productImageSrc } from "../lib/product-image";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});
  // Keep the source order: the first image is the primary/front view.
  const galleryImages = (images || []).filter(Boolean);
  const src = (img) => productImageSrc(img);

  return (
    <div className="pdp-gallery">
      <div className="pdp-main-img">
        {galleryImages[active] && !failed[active] ? (
          <img src={src(galleryImages[active])} alt={`${name} — view ${active + 1}`}
            onError={() => setFailed(f => ({ ...f, [active]: true }))} />
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
