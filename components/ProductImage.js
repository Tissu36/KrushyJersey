"use client";

export default function ProductImage({ src, alt, className }) {
  const handleImageError = (e) => {
    // If image fails, use a clean dark placeholder with neon text
    e.target.src = "https://placehold.co/600x800/111114/8B5CF6?text=KrushyJersey";
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      loading="lazy" 
      className={className}
      onError={handleImageError} 
    />
  );
}
