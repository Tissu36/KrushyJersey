"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Intro() {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('kj_seen')) return;
    setVisible(true);
  }, []);

  const startIntro = () => {
    setStarted(true);
    sessionStorage.setItem('kj_seen', '1');
    const audio = document.getElementById("kj-audio");
    if (audio) { audio.volume = 0.3; audio.play().catch(()=>{}); }

    const TOTAL = 20000, TIMES = [0, 5000, 10000, 15000];
    const IDS = ['s1', 's2', 's3', 's4'];
    let touts = [], done = false;
    
    const $ = id => document.getElementById(id);
    const activate = (i) => { IDS.forEach((id, j) => { const el = $(id); if(el) j===i ? el.classList.add('on') : el.classList.remove('on'); }); };
    const end = () => {
      if(done) return; done = true;
      touts.forEach(clearTimeout); touts = [];
      const el = $('kj');
      if(el) { el.classList.add('out'); setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, 1500); }
    };

    window.KJ = { skip: () => { if(done) return; touts.forEach(clearTimeout); activate(3); touts.push(setTimeout(end, 2000)); } };
    const cta = $('cta');
    if(cta) cta.addEventListener('click', function(e) { e.preventDefault(); const dest = this.href; end(); setTimeout(() => { window.location.href = dest; }, 1500); });

    activate(0);
    touts.push(setTimeout(() => activate(1), TIMES[1]));
    touts.push(setTimeout(() => activate(2), TIMES[2]));
    touts.push(setTimeout(() => activate(3), TIMES[3]));
    touts.push(setTimeout(end, TOTAL));
  };

  if (!visible) return null;
  if (!started) return (
    <div id="kj" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, position: 'fixed', inset: 0, background: '#060606' }}>
      <button onClick={startIntro} style={{ background: 'none', border: '1px solid #fff', color: '#fff', padding: '15px 30px', fontSize: '14px', letterSpacing: '4px', cursor: 'pointer', textTransform: 'uppercase' }}>TAP TO ENTER</button>
    </div>
  );

  return (
    <div id="kj" aria-hidden="false" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#060606', color: '#fff', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <audio id="kj-audio" src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3" loop />
      <div id="gr" style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}></div>
      <div id="vg" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 30%, #000 100%)', zIndex: 1 }}></div>
      <button id="sk" onClick={() => window.KJ && window.KJ.skip()} style={{ position: 'absolute', top: 20, right: 20, zIndex: 50, background: 'none', border: '1px solid #333', color: '#888', padding: '8px 16px', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>SKIP</button>
      <style>{`.scene { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.8s ease; padding: 20px; text-align: center; } .scene.on { opacity: 1 !important; }`}</style>

      <div className="scene" id="s1">
        <h1 style={{ fontSize: '60px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '5px', margin: 0 }}>KRUSHY</h1>
        <h1 style={{ fontSize: '60px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '5px', margin: 0, color: '#888' }}>JERSEY</h1>
        <div style={{ marginTop: '20px', maxWidth: '600px', background: 'rgba(0,0,0,0.6)', border: '1px solid #333', padding: '20px', textAlign: 'left' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '2px' }}>KRUSHY</p>
          <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6, color: '#ccc' }}><em>“Yo.”</em> Krushy here. Look — I’m not gonna give you some corporate speech. You know what this is. <em>Football jerseys.</em> Real ones. The kind that feel like they’ve got a story stitched into the fabric. From <em>retro classics</em> to the latest drops — I got you. Simple prices. No nonsense. Just pure, unadulterated football culture. <em>Let’s get it.</em></p>
        </div>
      </div>

      <div className="scene" id="s2">
        <h2 style={{ fontSize: '32px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '3px' }}>EVERY CLUB. EVERY LEAGUE.</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
          <img src="/images/0361a4b1ed71e9d2.jpg" alt="Arsenal" style={{ width: '80px', height: '100px', objectFit: 'contain' }} />
          <img src="/images/1bcf3b083bf349bf.jpg" alt="Barcelona" style={{ width: '80px', height: '100px', objectFit: 'contain' }} />
          <img src="/images/9cc9aa286ecf4656.jpg" alt="RMA" style={{ width: '80px', height: '100px', objectFit: 'contain' }} />
        </div>
      </div>

      <div className="scene" id="s3">
        <p style={{ letterSpacing: '5px', fontSize: '10px', color: '#888' }}>MORE THAN ONE TEAM</p>
        <h1 style={{ fontSize: '100px', fontFamily: 'Bebas Neue, sans-serif', margin: 0 }}>16,000+</h1>
        <p style={{ letterSpacing: '3px', fontSize: '12px', color: '#888' }}>JERSEYS ACROSS EVERY CLUB</p>
      </div>

      <div className="scene" id="s4">
        <h1 style={{ fontSize: '50px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '5px', margin: 0 }}>KRUSHYJERSEY</h1>
        <p style={{ letterSpacing: '3px', fontSize: '12px', color: '#888', marginTop: '10px' }}>SIMPLE PRICES</p>
        <a href="/shop" id="cta" style={{ marginTop: '30px', padding: '15px 40px', border: '1px solid #fff', color: '#fff', textDecoration: 'none', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Shop Now</a>
      </div>
    </div>
  );
}
