// Normalize image paths from current and legacy product imports.
export function productImageSrc(value) {
  if (!value || typeof value !== "string") return null;
  const image = value.trim();
  if (/^https?:\/\//i.test(image) || image.startsWith("data:")) return image;
  const normalized = image
    .replace(/^\.\//, "")
    .replace(/^public\//, "")
    .replace(/^\/?images\//, "")
    .replace(/^public\/images\//, "")
    .replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) return null;
  return "/images/" + normalized.split("/").map(encodeURIComponent).join("/");
}
