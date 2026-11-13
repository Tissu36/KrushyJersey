import products from "../products.json";

// Raw list — pages sort as needed (use parseInt(b.id) - parseInt(a.id) for newest first)
export function getProducts() { return products; }
export function getProduct(slug) { return products.find(p => p.slug === slug); }
export function getProductsByCategory(slug) {
  return products.filter(p => p.categorySlug === slug || (p.categories || []).includes(slug));
}
export function searchProducts(q) {
  const s = q.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(s) ||
    (p.categorySlug || "").replace(/-/g," ").includes(s)
  );
}
