"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Intro() {
  const [activeScene, setActiveScene] = useState(1);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(false); 
  const [started, setStarted] = useState(false);
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
    const hasSeenIntro = localStorage.getItem("krushy_intro_v3");
    if (hasSeenIntro) return; 
    setVisible(true);
  }, []);

  const startIntro = () => {
    setStarted(true);
    localStorage.setItem("krushy_intro_v3", "true");
    const audio = document.getElementById("intro-audio");
    if (audio) {
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
    // Start timers
    setTimeout(() => setActiveScene(2), 6500);
    setTimeout(() => setActiveScene(3), 14500);
    setTimeout(() => setActiveScene(4), 22500);
    setTimeout(() => skip(), 30000);
  };

  if (!visible) return null;

  if (!started) {
    return (
      <div id="intro-overlay" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
        <button onClick={startIntro} style={{ background: 'none', border: '1px solid #fff', color: '#fff', padding: '15px 30px', fontSize: '14px', letterSpacing: '4px', cursor: 'pointer', textTransform: 'uppercase' }}>
          TAP TO ENTER
        </button>
      </div>
    );
  }

  const getImg = (name) => "/images/images/" + name;

  return (
    <div id="intro-overlay" className={exiting ? "exiting" : ""}>
      <audio id="intro-audio" src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3" loop />
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
          <div className="lt">Your game.&nbsp; Your style.</div>
          <div className="ls">Football jerseys &mdash; simple prices</div>
        </div>
        <div className="speaker-box">
          <div className="speaker-name">KRUSHY</div>
          <div className="speaker-dialogue">
            <em>“Yo.”</em> Krushy here. Look — I’m not gonna give you some corporate speech. You know what this is. <em>Football jerseys.</em> Real ones. The kind that feel like they’ve got a story stitched into the fabric. From <em>retro classics</em> to the latest drops — I got you. Simple prices. No nonsense. Just pure, unadulterated football culture. <em>Let’s get it.</em>
          </div>
        </div>
      </div>

      <div className={`scene ${activeScene === 2 ? "active" : ""}`} id="s2">
        <div className="sh">Every Club. Every League.</div>
        <div className="jr">
          <div className="jc"><div className="ji"><div className="jw"><img src={getImg("0361a4b1ed71e9d2.jpg")} alt="Arsenal" /></div></div><span className="jl">Premier League</span></div>
          <div className="jc"><div className="ji"><div className="jw"><img src={getImg("1bcf3b083bf349bf.jpg")} alt="Barcelona" /></div></div><span className="jl">La Liga</span></div>
          <div className="jc"><div className="ji"><div className="jw"><img src={getImg("9cc9aa286ecf4656.jpg")} alt="Real Madrid" /></div></div><span className="jl">La Liga</span></div>
        </div>
        <div className="ls2">
          <span className="li">Premier League</span><span className="ld2"></span>
          <span className="li">La Liga</span><span className="ld2"></span>
          <span className="li">Serie A</span><span className="ld2"></span>
          <span className="li">Bundesliga</span><span className="ld2"></span>
          <span className="li">World Cup 2026</span>
        </div>
      </div>

      <div className={`scene ${activeScene === 3 ? "active" : ""}`} id="s3">
        <div className="ey">More than one team</div>
        <div className="sn">16,000+</div>
        <div className="sl">Jerseys across every club, league &amp; era</div>
      </div>

      <div className={`scene ${activeScene === 4 ? "active" : ""}`} id="s4">
        <div className="fn">KrushyJersey</div>
        <div className="ft">Football Jerseys &middot; Simple Prices</div>
        <div className="fd"></div>
        <button className="cta-btn" onClick={handleCta}>Shop Now</button>
      </div>
    </div>
  );
}
