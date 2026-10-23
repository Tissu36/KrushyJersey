"use client";
import { useState } from "react";

const SIZES = [
  { code: "S", label: "S" }, { code: "M", label: "M" }, { code: "L", label: "L" },
  { code: "XL", label: "XL" }, { code: "XXL", label: "XXL" },
  { code: "3XL", label: "3XL", up: 2 }, { code: "4XL", label: "4XL", up: 2 },
];

const PATCHES = [
  { key: "none", label: "No Badge", price: 0 },
  { key: "league", label: "League Patch", price: 3, img: "/badges/la-liga.svg" },
  { key: "ucl", label: "Champions League", price: 5, img: "/badges/ucl.svg" },
  { key: "both", label: "Both Patches", price: 7, dual: true },
];

export default function AddToCart({ product }) {
  const [size, setSize] = useState("M");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [patch, setPatch] = useState("none");

  const canCustomize = !!product.customizable;
  const sizeUp = SIZES.find(s => s.code === size)?.up || 0;
  const nameAndNum = !canCustomize ? 0 : (name && number ? 10 : name ? 6 : number ? 6 : 0);
  const patchCost = !canCustomize ? 0 : (PATCHES.find(p => p.key === patch)?.price || 0);
  const personalization = nameAndNum + patchCost + sizeUp;
  const total = product.price + personalization;

  const add = () => {
    const cart = JSON.parse(localStorage.getItem("krushy_cart") || "[]");
    cart.push({
      slug: product.slug, name: product.name, price: product.price,
      personalization, lineTotal: total, image: product.images[0],
      size, customName: canCustomize ? name : "",
      customNumber: canCustomize ? number : "",
      patch: canCustomize ? patch : "none", qty: 1,
    });
    localStorage.setItem("krushy_cart", JSON.stringify(cart));
    window.location.href = "/cart";
  };

  return (
    <div className="pdpOptions">
      <div className="pdpRow">
        <label className="pdpLabel">SIZE</label>
        <div className="sizeRow">
          {SIZES.map(s => (
            <button key={s.code} type="button" className={"sizePill" + (size === s.code ? " active" : "")} onClick={() => setSize(s.code)}>
              {s.label} {s.up ? <span className="sizeUp">+${s.up}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {canCustomize && (
        <>
          <div className="pdpRow">
            <label className="pdpLabel">BADGE (CHOOSE ONE)</label>
            <div className="patchGrid">
              {PATCHES.map(p => (
                <button key={p.key} type="button" className={"patchCard" + (patch === p.key ? " active" : "")} onClick={() => setPatch(p.key)}>
                  <div className="patchIconWrap">
                    {p.dual ? (
                      <><img src="/badges/la-liga.svg" alt="" className="patchImg halfL" /><img src="/badges/ucl.svg" alt="" className="patchImg halfR" /></>
                    ) : p.img ? (
                      <img src={p.img} alt={p.label} className="patchImg" />
                    ) : (
                      <div className="patchEmpty" />
                    )}
                  </div>
                  <div className="patchMeta">
                    <span className="patchTitle">{p.label}</span>
                    <span className="patchCost">{p.price === 0 ? "FREE" : "+$" + p.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pdpRow">
            <label className="pdpLabel">CUSTOM NAME &amp; NUMBER</label>
            <div className="nameNumberRow">
              <input className="pdpInput" type="text" placeholder="NAME" maxLength={12} value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
              <input className="pdpInput numInput" type="text" placeholder="##" maxLength={2} value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} />
            </div>
            <p className="pdpHint">Name + Number: +$10 · Only one: +$6</p>
          </div>
        </>
      )}

      <div className="priceBreakdown">
        <p><span>Jersey</span><strong>${product.price.toFixed(2)}</strong></p>
        {sizeUp > 0 && <p><span>Size upcharge</span><strong>+${sizeUp.toFixed(2)}</strong></p>}
        {personalization - sizeUp > 0 && <p><span>Personalization</span><strong>+${(personalization - sizeUp).toFixed(2)}</strong></p>}
        <p className="grandTotal"><span>Total</span><strong>${total.toFixed(2)} USD</strong></p>
      </div>

      <button className="buy" onClick={add}>ADD TO CART · ${total.toFixed(2)}</button>
    </div>
  );
}
