"use client";
import { useState } from "react";

export default function ProductClientUI({ product, price }) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="buy-box">
      {/* Size Selector */}
      <div className="form-group">
        <label>Size</label>
        <div className="size-grid">
          {sizes.map(size => (
            <button 
              key={size} 
              className={`size-btn ${selectedSize === size ? 'active' : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Customization */}
      <div className="form-group">
        <label>Customization (+$6 each)</label>
        <div className="custom-inputs">
          <input type="text" placeholder="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
          <input type="text" placeholder="Number" value={customNumber} onChange={(e) => setCustomNumber(e.target.value)} />
        </div>
      </div>

      {/* Quantity */}
      <div className="form-group">
        <label>Quantity</label>
        <div className="qty-selector">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn-add-cart">Add to Cart</button>
        <button className="btn-buy-now">Buy Now</button>
      </div>
    </div>
  );
}
