"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => { setCart(JSON.parse(localStorage.getItem("krushy_cart") || "[]")); }, []);
  const subtotal = cart.reduce((s, i) => s + (i.lineTotal || i.price) * i.qty, 0);
  return (
    <main className="section">
      <h1>Cart</h1>
      {cart.length === 0 ? <p>Your cart is empty. <Link href="/shop">Shop now</Link></p> : (
        <div className="cartList">
          {cart.map((item, i) => (
            <div key={i} className="cartItem">
              <strong>{item.name}</strong> - Size {item.size} - ${item.price}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
