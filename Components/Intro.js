"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Intro() {
  const [activeScene, setActiveScene] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  const skip = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 1600);
  };

  const handleCta = (e) => {
    e.preventDefault();
    skip();
    setTimeout(() => router.push("/shop"), 1500);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setActiveScene(2), 5600);
    const t2 = setTimeout(() => setActiveScene(3), 13600);
    const t3 = setTimeout(() => setActiveScene(4), 20800);
    const tEnd = setTimeout(() => skip(), 26000);

    let start = Date.now();
    const timer = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / 26000) * 100, 100);
      const fill = document.getElementById("intro-prog");
      if (fill) fill.style.width = pct + "%";
    }, 50);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(tEnd);
      clearInterval(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div id="intro-overlay" className={exiting ? "exiting" : ""}>
      <div id="grain"></div>
      <div id="vignette"></div>
      <div className="lb" id="lb-t" style={{ height: "5.8vmin" }}></div>
      <div className="lb" id="lb-b" style={{ height: "5.8vmin" }}></div>
      <div id="bo"></div>

      <button id="skip" onClick={skip}>Skip</button>
      <div id="prog"><div id="prog-fill" id="intro-prog"></div></div>

      <div className={`scene ${activeScene === 1 ? "active" : ""}`} id="s1">
        <div className="logo">
          <span className="ll"><span className="lk">KRUSHY</span></span>
          <span className="ll"><span className="lj">JERSEY</span></span>
          <div className="ld"></div>
          <div className="lt">Your game. Your style.</div>
          <div className="ls">Football jerseys &mdash; simple prices</div>
        </div>
      </div>

      <div className={`scene ${activeScene === 2 ? "active" : ""}`} id="s2">
        <div className="sh">Every Club. Every League.</div>
        <div className="jr">
          <div className="jc">
            <div className="ji"><div className="jw">
              <img className="jp" src="https://krushy-jersey-gold.vercel.app/images/0361a4b1ed71e9d2.jpg" alt="Arsenal" onError={(e) => e.target.classList.add('h')} />
            </div></div>
            <span className="jl">Premier League</span>
          </div>
          <div className="jc">
            <div className="ji"><div className="jw">
              <img className="jp" src
