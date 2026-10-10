import products from "../products.json";

export function getProducts() { return products; }
export function getProduct(slug) { return products.find(p => p.slug === slug); }
export function getProductsByCategory(cat) {
  const c = cat.toLowerCase();
  return products.filter(p => (p.categories || [p.categorySlug]).includes(c));
}
export function searchProducts(q) {
  const s = q.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
  );
}
export function getCategories() {
  const seen = new Map();
  for (const p of products) {
    if (!seen.has(p.categorySlug)) {
      seen.set(p.categorySlug, { slug: p.categorySlug, name: p.category, count: 0 });
    }
    seen.get(p.categorySlug).count++;
  }
  return [...seen.values()].sort((a, b) => b.count - a.count);
}
