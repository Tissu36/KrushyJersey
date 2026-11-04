"use client";
import { useState } from "react";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AddToCart({ product }) {
  const [size, setSize] = useState("M");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [adding, setAdding] = useState(false);

  // Price logic: Base price + 10% increase + customization
  const basePrice = (product.price * 1.10).toFixed(2); 
  const customizationCost = (name ? 6 : 0) + (number ? 6 : 0);
  const total = (parseFloat(basePrice) + customizationCost).toFixed(2);

  const handleAdd = () => {
    setAdding(true);
    const cart = JSON.parse(localStorage.getItem("krushy_cart") || "[]");
    cart.push({
      id: Date.now(),
      slug: product.slug,
      name: product.name,
      price: parseFloat(basePrice),
      image: product.images[0],
      size,
      customName: name,
      customNumber: number,
      personalization: customizationCost,
      lineTotal: parseFloat(total),
      qty: 1
    });
    localStorage.setItem("krushy_cart", JSON.stringify(cart));
    window.location.href = "/cart";
  };

  return (
    <div className="pdpOptions">
      <div className="pdpRow">
        <label className="pdpLabel">SELECT SIZE</label>
        <div className="sizeRow">
          {SIZES.map(s => (
            <button key={s} type="button" className={"sizePill" + (size === s ? " active" : "")} onClick={() => setSize(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="pdpRow">
        <label className="pdpLabel">CUSTOMIZATION (+$6 EACH)</label>
        <div className="nameNumberRow">
          <input className="pdpInput" type="text" placeholder="NAME" maxLength={12} value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
          <input className="pdpInput numInput" type="text" placeholder="##" maxLength={2} value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>

      <div className="priceBreakdown">
        <p><span>Jersey</span><strong>${basePrice} CAD</strong></p>
        {customizationCost > 0 && <p><span>Customization</span><strong>+$${customizationCost.toFixed(2)}</strong></p>}
        <p className="grandTotal"><span>Total</span><strong>${total} CAD</strong></p>
      </div>

      <button className="buy" onClick={handleAdd} disabled={adding}>
        {adding ? "ADDING..." : `ADD TO CART — $${total}`}
      </button>
    </div>
  );
}
