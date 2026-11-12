"use client";
import { useEffect, useState } from "react";

export default function Intro() {
  const [visible,  setVisible]  = useState(false);
  const [started,  setStarted]  = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("kj_seen")) return;
    setVisible(true);
  }, []);

  const startIntro = () => {
    setStarted(true);
    sessionStorage.setItem("kj_seen", "1");

    const TOTAL = 20000;
    const TIMES = [0, 5000, 10000, 15000];
    const IDS   = ["s1", "s2", "s3", "s4"];
    let touts = [], done = false;

    const $  = id => document.getElementById(id);
    const on = i => IDS.forEach((id, j) => {
      const el = $(id);
      if (el) j === i ? el.classList.add("on") : el.classList.remove("on");
    });
    const end = () => {
      if (done) return; done = true;
      touts.forEach(clearTimeout);
      const el = $("kj");
      if (el) { el.classList.add("out"); setTimeout(() => el.parentNode?.removeChild(el), 1500); }
    };

    window.KJ = { skip: () => { if (done) return; touts.forEach(clearTimeout); on(3); touts.push(setTimeout(end, 2000)); } };
    const cta = $("kj-cta");
    if (cta) cta.addEventListener("click", e => { e.preventDefault(); const href = cta.getAttribute("href"); end(); setTimeout(() => { window.location.href = href; }, 1500); });

    on(0);
    TIMES.slice(1).forEach((t, i) => { touts.push(setTimeout(() => on(i + 1), t)); });
    touts.push(setTimeout(end, TOTAL));
  };

  if (!visible) return null;

  if (!started) return (
    <div id="kj" style={{ position:"fixed", inset:0, zIndex:10000, background:"#060608", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:24 }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:48, letterSpacing:8, color:"#fff" }}>KRUSHYJERSEY</div>
      <div style={{ width:60, height:1, background:"rgba(168,85,247,0.6)" }} />
      <button onClick={startIntro} style={{
        background:"transparent", border:"1px solid rgba(168,85,247,0.6)", color:"#fff",
        padding:"14px 36px", fontSize:11, letterSpacing:4, cursor:"pointer",
        textTransform:"uppercase", fontFamily:"inherit",
        transition:"all 0.3s", borderRadius:2,
      }}
        onMouseEnter={e => { e.target.style.background = "rgba(168,85,247,0.15)"; e.target.style.borderColor = "#a855f7"; }}
        onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(168,85,247,0.6)"; }}
      >
        TAP TO ENTER
      </button>
    </div>
  );

  return (
    <div id="kj" style={{ position:"fixed", inset:0, zIndex:9999, background:"#060608", color:"#fff", overflow:"hidden", fontFamily:"Inter,sans-serif", transition:"opacity 1.35s ease" }}>
      <style>{`
        #kj { --acc:#a855f7; }
        #kj.out { opacity:0; pointer-events:none; }
        #kj .sc { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0; transition:opacity 0.8s ease; padding:40px 28px; text-align:center; pointer-events:none; }
        #kj .sc.on { opacity:1; pointer-events:auto; }
        @keyframes kj-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kj-cu { from{opacity:0;transform:translateY(110%)} to{opacity:1;transform:translateY(0)} }
        @keyframes kj-flt { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes kj-grd { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        #kj #sk { position:absolute; top:20px; right:20px; z-index:30; background:transparent; border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.4); font-size:10px; letter-spacing:3px; padding:9px 16px; cursor:pointer; text-transform:uppercase; font-family:inherit; transition:all 0.3s; }
        #kj #sk:hover { border-color:rgba(168,85,247,0.6); color:#fff; }
        .kj-line { overflow:hidden; }
        .kj-word { display:block; opacity:0; transform:translateY(110%); }
        #s1.on .kj-word:nth-child(1) { animation:kj-cu 1.1s 0.1s cubic-bezier(.16,1,.3,1) forwards; }
        #s1.on .kj-word:nth-child(2) { animation:kj-cu 1.1s 0.45s cubic-bezier(.16,1,.3,1) forwards; }
        #s1.on .kj-sub { animation:kj-up 0.9s 1.6s ease forwards; }
        #s1.on .kj-tag { animation:kj-up 0.8s 2.4s ease forwards; }
        .kj-sub,.kj-tag { opacity:0; }
        #s2.on .jc:nth-child(1) { animation:kj-up 0.7s 0.1s ease forwards; }
        #s2.on .jc:nth-child(2) { animation:kj-up 0.7s 0.3s ease forwards; }
        #s2.on .jc:nth-child(3) { animation:kj-up 0.7s 0.5s ease forwards; }
        #s2.on .jc:nth-child(1) img { animation:kj-flt 5s 1s ease-in-out infinite; }
        #s2.on .jc:nth-child(2) img { animation:kj-flt 5s 1.5s ease-in-out infinite; }
        #s2.on .jc:nth-child(3) img { animation:kj-flt 5s 2s ease-in-out infinite; }
        .jc { opacity:0; display:flex; flex-direction:column; align-items:center; gap:12px; }
        #s2 .s2h { opacity:0; font-family:'Bebas Neue',sans-serif; font-size:clamp(28px,5vw,60px); letter-spacing:4px; margin-bottom:8px; }
        #s2.on .s2h { animation:kj-up 0.8s 0s ease forwards; }
        #s3.on .s3big { animation:kj-up 1s 0.1s cubic-bezier(.16,1,.3,1) forwards; }
        #s3.on .s3sub { animation:kj-up 0.8s 0.9s ease forwards; }
        .s3big,.s3sub { opacity:0; }
        #s4.on .s4name { animation:kj-up 0.9s 0.1s ease forwards; }
        #s4.on .s4tag  { animation:kj-up 0.7s 0.7s ease forwards; }
        #s4.on .s4cta  { animation:kj-up 0.7s 1.2s ease forwards; }
        .s4name,.s4tag,.s4cta { opacity:0; }
      `}</style>

      <button id="sk" onClick={() => window.KJ?.skip()}>SKIP</button>

      {/* Scene 1 — Brand */}
      <div className="sc" id="s1">
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(64px,14vw,160px)", lineHeight:0.88, letterSpacing:"0.1em" }}>
          <div className="kj-line"><span className="kj-word">KRUSHY</span></div>
          <div className="kj-line"><span className="kj-word" style={{ background:"linear-gradient(90deg,#a855f7,#7c3aed)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent" }}>JERSEY</span></div>
        </div>
        <div className="kj-sub" style={{ marginTop:28, fontSize:12, letterSpacing:5, color:"rgba(255,255,255,0.4)", textTransform:"uppercase" }}>
          More than just a jersey
        </div>
        <div className="kj-tag" style={{ marginTop:14, padding:"6px 20px", border:"1px solid rgba(168,85,247,0.4)", fontSize:10, letterSpacing:4, color:"rgba(168,85,247,0.8)", textTransform:"uppercase" }}>
          Est. 2024
        </div>
      </div>

      {/* Scene 2 — Jerseys */}
      <div className="sc" id="s2">
        <p className="s2h">EVERY CLUB. EVERY LEAGUE.</p>
        <div style={{ display:"flex", gap:"clamp(14px,3vw,48px)", alignItems:"flex-end", justifyContent:"center" }}>
          {[
            { src:"/images/0361a4b1ed71e9d2.jpg", label:"Arsenal",   size:90 },
            { src:"/images/9cc9aa286ecf4656.jpg", label:"Real Madrid", size:120 },
            { src:"/images/1bcf3b083bf349bf.jpg", label:"Barcelona", size:90 },
          ].map(j => (
            <div key={j.label} className="jc">
              <img src={j.src} alt={j.label} style={{ width:j.size, height:j.size*1.25, objectFit:"contain", filter:"drop-shadow(0 12px 30px rgba(0,0,0,0.6))" }} />
              <span style={{ fontSize:9, letterSpacing:4, textTransform:"uppercase", color:"rgba(255,255,255,0.4)" }}>{j.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scene 3 — 16,000+ */}
      <div className="sc" id="s3">
        <p style={{ fontSize:11, letterSpacing:5, color:"rgba(168,85,247,0.8)", textTransform:"uppercase", marginBottom:16, opacity:1 }}>The collection</p>
        <div className="s3big" style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(80px,20vw,220px)",
          lineHeight:0.85,
          background:"linear-gradient(135deg,#fff 40%,#a855f7)",
          backgroundSize:"200%",
          WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:"kj-grd 4s ease infinite",
        }}>16,000+</div>
        <div className="s3sub" style={{ marginTop:20, fontSize:12, letterSpacing:4, color:"rgba(255,255,255,0.4)", textTransform:"uppercase" }}>
          Authentic jerseys across every club
        </div>
      </div>

      {/* Scene 4 — CTA */}
      <div className="sc" id="s4">
        <div className="s4name" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,8vw,96px)", letterSpacing:"0.12em" }}>KRUSHYJERSEY</div>
        <div className="s4tag" style={{ fontSize:11, letterSpacing:5, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", marginTop:12 }}>
          Simple prices. No nonsense. Pure football culture.
        </div>
        <div style={{ width:"min(260px,60vw)", height:1, background:"rgba(168,85,247,0.3)", margin:"30px auto" }} />
        <a id="kj-cta" href="/shop" className="s4cta" style={{
          display:"inline-block", padding:"16px 48px",
          background:"linear-gradient(135deg,#a855f7,#7c3aed)",
          color:"#fff", fontSize:12, letterSpacing:4,
          textTransform:"uppercase", textDecoration:"none",
          fontFamily:"inherit", fontWeight:700, borderRadius:2,
          boxShadow:"0 0 40px rgba(168,85,247,0.4)",
        }}>Shop Now →</a>
      </div>
    </div>
  );
}
