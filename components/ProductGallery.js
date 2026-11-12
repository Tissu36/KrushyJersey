"use client";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});

  const src = (img) => `/images/${(img || "").replace(/^images\//, "")}`;

  return (
    <div className="pdp-gallery">
      <div className="pdp-main-img">
        {images[active] && !failed[active] ? (
          <img
            src={src(images[active])}
            alt={`${name} — view ${active + 1}`}
            onError={() => setFailed(f => ({ ...f, [active]: true }))}
          />
        ) : (
          <div className="img-placeholder" style={{ height: "100%" }}>
            <span className="ph-icon">👕</span>
            <p className="ph-name">{name}</p>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="pdp-thumbs">
          {images.slice(0, 6).map((img, i) => (
            <div
              key={i}
              className={`pdp-thumb${active === i ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              {!failed[i] ? (
                <img
                  src={src(img)}
                  alt={`${name} ${i + 1}`}
                  onError={() => setFailed(f => ({ ...f, [i]: true }))}
                />
              ) : (
                <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👕</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
