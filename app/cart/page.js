"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => { setCart(JSON.parse(localStorage.getItem("krushy_cart") || "[]")); }, []);
  const subtotal = cart.reduce((s, i) => s + (i.lineTotal || i.price) * i.qty, 0);
  const shipping = subtotal > 0 ? (subtotal >= 150 ? 0 : 10) : 0;
  const total = subtotal + shipping;
  const update = (idx, delta) => {
    const next = [...cart];
    next[idx].qty += delta;
    if (next[idx].qty <= 0) next.splice(idx, 1);
    setCart(next);
    localStorage.setItem("krushy_cart", JSON.stringify(next));
  };
  const clear = () => { setCart([]); localStorage.removeItem("krushy_cart"); };
  return (
    <main className="section">
      <h1>Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty. <Link href="/shop">Shop now</Link></p> : (
        <>
          <div className="cartList">
            {cart.map((item, i) => (
              <div key={i} className="cartItem">
                <img src={`/images/${item.image}`} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>Size {item.size}{item.customName ? " · " + item.customName : ""}{item.customNumber ? " #" + item.customNumber : ""}</p>
                  {item.patch && item.patch !== "none" && <p className="muted">Patch: {item.patch}</p>}
                </div>
                <div className="qty">
                  <button onClick={() => update(i, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => update(i, 1)}>+</button>
                </div>
                <div className="price">${((item.lineTotal || item.price) * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="cartSummary">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Shipping: ${shipping.toFixed(2)}{shipping === 0 ? " (free)" : ""}</p>
            <p className="total">Total: ${total.toFixed(2)} USD</p>
            <button className="buy" onClick={() => alert("Stripe checkout coming soon.")}>CHECKOUT</button>
            <button onClick={clear} className="muted">Clear cart</button>
          </div>
        </>
      )}
    </main>
  );
}
