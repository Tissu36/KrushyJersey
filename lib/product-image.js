// Convert catalogue image values into valid public or remote image URLs.
export function productImageSrc(value) {
  if (typeof value !== "string") return null;
  const image = value.trim();
  if (!image) return null;

  // Preserve fully qualified and protocol-relative image URLs.
  if (/^(https?:)?\/\//i.test(image) || image.startsWith("data:") || image.startsWith("blob:")) {
    return image.startsWith("//") ? `https:${image}` : image;
  }

  // Catalogue records may contain /images/x.jpg, public/images/x.jpg,
  // ./x.jpg, or just x.jpg. All local assets live in public/images.
  const normalized = image
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/?public\//, "")
    .replace(/^\/?images\//, "")
    .replace(/^\/+/, "");

  if (!normalized || normalized.split("/").some(part => part === "..")) return null;
  return "/images/" + normalized.split("/").map(encodeURIComponent).join("/");
}
