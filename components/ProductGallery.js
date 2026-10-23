"use client";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [activeImg, setActiveImg] = useState(images[0] || null);
  const getUrl = (img) => "/images/images/" + img.replace(/^images\//, "");

  if (!images || images.length === 0) {
    return <div className="gallery"><div className="bigVisual jerseyMock">{name}</div></div>;
  }

  return (
    <div className="gallery">
      <div className="bigVisual" style={{ background: "#0f0f0f" }}>
        {activeImg ? <img src={getUrl(activeImg)} alt={name} /> : <div className="jerseyMock">{name}</div>}
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.slice(0, 8).map((im, i) => (
            <img 
              key={i} src={getUrl(im)} alt={name} loading="lazy" 
              onClick={() => setActiveImg(im)}
              style={{ border: activeImg === im ? "2px solid white" : "1px solid var(--line)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
