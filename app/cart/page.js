"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currency, setCurrency] = useState("CAD");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("krushy_cart") || "[]"));
    setLoaded(true);
  }, []);

  const updateQty = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const qty = Math.max(1, item.qty + delta);
        return { ...item, qty, lineTotal: (item.price + item.personalization) * qty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem("krushy_cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("krushy_cart", JSON.stringify(newCart));
  };

  if (!loaded) return <main className="section"><h1>Loading...</h1></main>;

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 0 && subtotal < 150 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <main className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>YOUR CART</h1>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ padding: '10px', background: 'var(--card)', color: '#fff', border: '1px solid var(--line)', borderRadius: '4px' }}>
          <option value="CAD">CAD $</option>
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="GBP">GBP £</option>
        </select>
      </div>
      
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link href="/shop" style={{color: 'var(--accent)'}}>Shop Now</Link></p>
      ) : (
        <div className="cartLayout">
          <div className="cartItems">
            {cart.map(item => (
              <div key={item.id} className="cartItem">
                <img src={`/images/${item.image.replace(/^images\//, "")}`} alt={item.name} />
                <div className="cartInfo">
                  <h3>{item.name}</h3>
                  <p>Size: {item.size} | Name: {item.customName || "None"} | Num: {item.customNumber || "None"}</p>
                  <p className="price">${item.lineTotal.toFixed(2)} CAD</p>
                  <div className="cartActions">
                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                    <button className="remove" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cartSummary">
            <h3>ORDER SUMMARY</h3>
            <p><span>Subtotal</span><span>${subtotal.toFixed(2)} CAD</span></p>
            <p><span>Shipping</span><span>${shipping.toFixed(2)} CAD</span></p>
            <p className="total"><span>Total</span><span>${total.toFixed(2)} CAD</span></p>
            <button className="buy" onClick={() => window.location.href = "/api/checkout"}>CHECKOUT SECURELY</button>
          </div>
        </div>
      )}
    </main>
  );
}
