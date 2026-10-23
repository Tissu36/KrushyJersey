"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => { 
    if (window.location.search.includes("success=1")) {
      localStorage.removeItem("krushy_cart");
      setCart([]);
    } else {
      setCart(JSON.parse(localStorage.getItem("krushy_cart") || "[]")); 
    }
  }, []);
  
  const subtotal = cart.reduce((s, i) => s + (i.lineTotal || i.price) * i.qty, 0);
  const shipping = subtotal > 0 ? (subtotal >= 150 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  return (
    <main className="section">
      <h1>Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty. <Link href="/shop">Shop now</Link></p> : (
        <>
          <div className="cartList">
            {cart.map((item, i) => (
              <div key={i} className="cartItem">
                <img src={"/images/images/" + item.image.replace(/^images\//, "")} alt={item.name} />
                <div><strong>{item.name}</strong><p>Size {item.size} {item.customName ? "· " + item.customName : ""} {item.patch !== "none" ? "· " + item.patch : ""}</p></div>
                <div className="price">\${((item.lineTotal || item.price) * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="cartSummary">
            <p>Subtotal: \${subtotal.toFixed(2)}</p>
            <p>Shipping: \${shipping.toFixed(2)}</p>
            <p className="total">Total: \${total.toFixed(2)} USD</p>
            <button className="buy" onClick={() => alert("Checkout coming soon (Moneris)")}>CHECKOUT</button>
          </div>
        </>
      )}
    </main>
  );
}
