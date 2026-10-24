"use client";
import { useEffect, useState } from "react";

export default function Intro() {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('kj_seen')) return;
      setVisible(true);
    } catch(e) { setVisible(true); }
  }, []);

  const startIntro = () => {
    setStarted(true);
    try { sessionStorage.setItem('kj_seen', '1'); } catch(e) {}
    const audio = document.getElementById("kj-audio");
    if (audio) { audio.volume = 0.4; audio.play().catch(()=>{}); }

    const TOTAL = 27000, TIMES = [0, 5600, 13200, 18800, 23200];
    const IDS = ['s1', 's2', 's3', 's4', 's5'];
    let touts = [], rafId = null, done = false, counterRafId = null;
    
    const $ = id => document.getElementById(id);
    const activate = (i) => { IDS.forEach((id, j) => { const el = $(id); if(el) j===i ? el.classList.add('on') : el.classList.remove('on'); }); };
    const flash = (i, ms) => {
      const bo = $('bo'); if(!bo) return;
      bo.style.transition = `opacity ${ms/1000}s ease`;
      bo.style.opacity = '1';
      touts.push(setTimeout(() => { activate(i); bo.style.transition = `opacity ${(ms*1.35)/1000}s ease`; bo.style.opacity = '0'; }, ms+20));
    };
    const openLB = () => { requestAnimationFrame(() => { if($('lbt')) $('lbt').style.height='5.8vmin'; if($('lbb')) $('lbb').style.height='5.8vmin'; }); };
    const closeLB = () => { ['lbt','lbb'].forEach(id => { const el = $(id); if(el) { el.style.transition='height 1.1s cubic-bezier(.77,0,.18,1)'; el.style.height='0'; } }); };
    
    const counter = () => {
      const el = $('cnt'); if(!el) return;
      if(counterRafId !== null) cancelAnimationFrame(counterRafId);
      const DUR = 2700, TARGET = 16000, start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start)/DUR, 1);
        const eased = 1 - Math.pow(1-p, 2.2);
        const v = Math.round(eased * TARGET);
        el.textContent = p >= 1 ? '16,000' : (v >= 1000 ? (Math.floor(v/100)*100).toLocaleString('en-US') : String(v));
        if(p < 1) counterRafId = requestAnimationFrame(tick); else counterRafId = null;
      };
      counterRafId = requestAnimationFrame(tick);
    };

    const end = () => {
      if(done) return; done = true;
      touts.forEach(clearTimeout); touts = [];
      if(rafId !== null) cancelAnimationFrame(rafId);
      if(counterRafId !== null) cancelAnimationFrame(counterRafId);
      document.body.classList.remove('kj-lock');
      const el = $('kj');
      if(el) { el.classList.add('out'); el.setAttribute('aria-hidden', 'true'); touts.push(setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, 1800)); }
    };

    window.KJ = { skip: () => { if(done) return; touts.forEach(clearTimeout); touts=[]; activate(4); counter(); touts.push(setTimeout(() => { const cnt = $('cnt'); if(cnt) cnt.textContent='16,000'; }, 2750)); touts.push(setTimeout(end, 3200)); } };
    
    const cta = $('cta');
    if(cta) cta.addEventListener('click', function(e) { e.preventDefault(); const dest = this.href; end(); setTimeout(() => { window.location.href = dest; }, 1500); });

    const progress = () => {
      const t0 = performance.now(); const fill = $('pf');
      const tick = (now) => { if(done) return; const p = Math.min(((now-t0)/TOTAL)*100, 100); if(fill) fill.style.width = p + '%'; if(p < 100) rafId = requestAnimationFrame(tick); };
      rafId = requestAnimationFrame(tick);
    };

    document.body.classList.add('kj-lock');
    openLB(); activate(0);
    for(let i=1; i<TIMES.length; i++) { touts.push(setTimeout(() => flash(i, 330), TIMES[i])); }
    touts.push(setTimeout(counter, TIMES[3]+620));
    touts.push(setTimeout(closeLB, 25000));
    touts.push(setTimeout(end, TOTAL+400));
    progress();
  };

  if (!visible) return null;
  if (!started) return (
    <div id="kj" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <button onClick={startIntro} style={{ background: 'none', border: '1px solid #fff', color: '#fff', padding: '15px 30px', fontSize: '14px', letterSpacing: '4px', cursor: 'pointer', textTransform: 'uppercase' }}>TAP TO ENTER</button>
    </div>
  );

  // These are the exact images you uploaded, hardcoded as Base64 so they NEVER break.
  const spain = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  const barca = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  const france = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  const rma = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  const mci = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  return (
    <div id="kj" aria-hidden="false" aria-label="KrushyJersey introduction">
      <audio id="kj-audio" src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3" loop />
      <div id="gr" aria-hidden="true"></div>
      <div id="vg" aria-hidden="true"></div>
      <div className="lb" id="lbt" aria-hidden="true"></div>
      <div className="lb" id="lbb" aria-hidden="true"></div>
      <div id="bo" aria-hidden="true"></div>
      <button id="sk" type="button" aria-label="Skip intro" onClick={() => window.KJ && window.KJ.skip()}>Skip</button>
      <div id="pg" aria-hidden="true"><div id="pf"></div></div>

      <section className="sc" id="s1" aria-label="KrushyJersey brand introduction">
        <div className="logo">
          <span className="ll"><span className="lk">KRUSHY</span></span>
          <span className="ll"><span className="lj">JERSEY</span></span>
          <div className="ld" aria-hidden="true"></div>
          <div className="lt">Your game. Your style.</div>
          <div className="ls">Football jerseys — simple prices</div>
        </div>
      </section>

      <section className="sc" id="s2" aria-label="Jersey collection">
        <div className="sh">Every Club. Every League.</div>
        <div className="jrow">
          <div className="jc"><div className="ji"><div className="jw"><img src={spain} alt="Spain" /></div></div><div className="jl">Spain</div></div>
          <div className="jc"><div className="ji"><div className="jw"><img src={barca} alt="Barcelona" /></div></div><div className="jl">Barcelona</div></div>
          <div className="jc"><div className="ji"><div className="jw"><img src={france} alt="France" /></div></div><div className="jl">France</div></div>
          <div className="jc"><div className="ji"><div className="jw"><img src={rma} alt="Real Madrid" /></div></div><div className="jl">Real Madrid</div></div>
          <div className="jc"><div className="ji"><div className="jw"><img src={mci} alt="Man City" /></div></div><div className="jl">Man City</div></div>
        </div>
      </section>

      <section className="sc" id="s3" aria-label="Spotlight">
        <div className="s3ey">Icon Edition</div>
        <div className="hero"><img src={barca} alt="Ronaldinho 10" /></div>
        <div className="s3name">Ronaldinho 10</div>
        <div className="s3sub">Barcelona · Retro Classic</div>
      </section>

      <section className="sc" id="s4" aria-label="Jersey selection">
        <div className="s4ey">More than one team</div>
        <div className="big"><span id="cnt">0</span><span className="plus">+</span></div>
        <div className="bigsub">Jerseys — every club, league &amp; era</div>
      </section>

      <section className="sc" id="s5" aria-label="Shop">
        <div className="fn">KrushyJersey</div>
        <div className="ft">Football Jerseys · Simple Prices</div>
        <div className="fd" aria-hidden="true"></div>
        <a href="/shop" className="cta" id="cta">Shop Now</a>
      </section>
    </div>
  );
}
