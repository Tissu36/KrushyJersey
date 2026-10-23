"use client";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [activeImg, setActiveImg] = useState(images[0] || null);

  const getUrl = (img) => img.startsWith('images/') ? `/${img}` : `/images/images/${img}`;

  if (!images || images.length === 0) {
    return <div className="gallery"><div className="bigVisual jerseyMock">{name}</div></div>;
  }

  return (
    <div className="gallery">
      <div className="bigVisual">
        {activeImg ? <img src={getUrl(activeImg)} alt={name} /> : <div className="jerseyMock">{name}</div>}
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.slice(0, 8).map((im, i) => (
            <img 
              key={i} 
              src={getUrl(im)} 
              alt={`${name} ${i + 1}`} 
              loading="lazy" 
              onClick={() => setActiveImg(im)}
              style={{ border: activeImg === im ? '2px solid white' : '1px solid var(--line)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
