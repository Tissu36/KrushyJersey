"use client";
import { useEffect } from "react";

export default function Intro() {
  useEffect(() => {
    // If they already saw it, skip it instantly
    if (sessionStorage.getItem('kj_seen')) {
      const kj = document.getElementById('kj');
      if (kj) kj.classList.add('gone');
      return;
    }

    let scenes = ['s1', 's2', 's3', 's4', 's5'];
    let durations = [5000, 6000, 5000, 6000, 4000];
    let current = -1;
    let timers = [];
    let soundOn = false;
    let counterDone = false;
    let audioCtx = null;
    let hum = null;

    function clearTimers() { timers.forEach(t => clearTimeout(t)); timers = []; }
    function setProgress(pct) {
      const pf = document.getElementById('pf');
      const pg = document.getElementById('pg');
      if(pf) pf.style.width = pct + '%';
      if(pg) pg.setAttribute('aria-valuenow', Math.round(pct));
    }
    function activate(id) {
      const el = document.getElementById(id);
      if (el) { el.classList.add('on'); el.setAttribute('aria-hidden', 'false'); }
    }
    function deactivate(id) {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('on'); el.setAttribute('aria-hidden', 'true'); }
    }
    function animateCounter() {
      if (counterDone) return;
      counterDone = true;
      const el = document.getElementById('cnt');
      const target = 16000;
      const duration = 2000;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        if(el) el.textContent = Math.round(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
        else if(el) el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    }
    function showNext() {
      if (current >= 0) deactivate(scenes[current]);
      current++;
      if (current >= scenes.length) {
        setProgress(100);
        window.KJ.skip();
        return;
      }
      activate(scenes[current]);
      if (scenes[current] === 's4') timers.push(setTimeout(animateCounter, 400));
      
      const total = durations.reduce((a, b) => a + b, 0);
      const elapsed = durations.slice(0, current + 1).reduce((a, b) => a + b, 0);
      setProgress((elapsed / total) * 100);
      
      if (current < scenes.length - 1) {
        timers.push(setTimeout(showNext, durations[current]));
      } else {
        timers.push(setTimeout(() => { setProgress(100); window.KJ.skip(); }, durations[current]));
      }
    }
    function startAudio() {
      if (audioCtx) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = 55;
        gain.gain.value = 0.0001;
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 1.5);
        hum = { osc, gain };
      } catch (e) {}
    }
    function stopAudio() {
      if (!hum || !audioCtx) return;
      try {
        hum.gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        hum.osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {}
      hum = null;
    }

    window.KJ = {
      skip: function () {
        clearTimers();
        const kj = document.getElementById('kj');
        if (kj) { kj.classList.add('out'); kj.setAttribute('aria-hidden', 'true'); }
        stopAudio();
        sessionStorage.setItem('kj_seen', '1');
        setTimeout(() => { if (kj) kj.classList.add('gone'); }, 1800);
      },
      toggleSound: function () {
        soundOn = !soundOn;
        const btn = document.getElementById('snd');
        if (btn) soundOn ? btn.classList.add('on') : btn.classList.remove('on');
        if (soundOn) startAudio(); else stopAudio();
      }
    };

    const kj = document.getElementById('kj');
    if(kj) kj.classList.add('on');
    setTimeout(showNext, 300);

    return () => clearTimers();
  }, []);

  return (
    <div id="kj" className="kj-intro">
      <div id="gr"></div><div id="vg"></div>
      <div className="lb" id="lbt"></div><div className="lb" id="lbb"></div>
      <div id="bo"></div>
      <button id="snd" aria-label="Toggle sound" onClick={() => window.KJ.toggleSound()}>♪ Sound</button>
      <button id="sk" aria-label="Skip intro" onClick={() => window.KJ.skip()}>Skip</button>
      <div id="pg" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="pf"></div></div>

      <div className="sc" id="s1">
        <div className="logo">
          <span className="ll"><span className="lk">KRUSHY</span></span>
          <span className="ll"><span className="lj">JERSEY</span></span>
          <div className="ld"></div>
          <div className="lt">Your game.&nbsp; Your style.</div>
          <div className="ls">Football jerseys &mdash; simple prices</div>
        </div>
      </div>

      <div className="sc" id="s2">
        <div className="sh">Every Club. Every League.</div>
        <div className="jrow">
          <div className="jc"><div className="ji"><div className="jw"><img src="/images/spain.png" alt="Spain" /></div></div><span className="jl">Spain</span></div>
          <div className="jc"><div className="ji"><div className="jw"><img src="/images/barcelona.png" alt="Barcelona" /></div></div><span className="jl">Barcelona</span></div>
          <div className="jc"><div className="ji"><div className="jw"><img src="/images/france.png" alt="France" /></div></div><span className="jl">France</span></div>
          <div className="jc"><div className="ji"><div className="jw"><img src="/images/realmadrid.png" alt="Real Madrid" /></div></div><span className="jl">Real Madrid</span></div>
          <div className="jc"><div className="ji"><div className="jw"><img src="/images/mancity.png" alt="Man City" /></div></div><span className="jl">Man City</span></div>
        </div>
        <div className="lstrip">
          <span className="li">Premier League</span><span className="ldot"></span>
          <span className="li">La Liga</span><span className="ldot"></span>
          <span className="li">National Teams</span><span className="ldot"></span>
          <span className="li">Retro</span><span className="ldot"></span>
          <span className="li">World Cup 2026</span>
        </div>
      </div>

      <div className="sc" id="s3">
        <div className="ey">Icon Edition</div>
        <div className="hero"><img src="/images/barcelona.png" alt="Ronaldinho 10" /></div>
        <div className="s3name">Ronaldinho 10</div>
        <div className="s3sub">Barcelona &nbsp;&middot;&nbsp; Retro Classic</div>
      </div>

      <div className="sc" id="s4">
        <div className="ey4">More than one team</div>
        <div className="big"><span id="cnt">0</span>+</div>
        <div className="bigsub">Jerseys &mdash; every club, league &amp; era</div>
      </div>

      <div className="sc" id="s5">
        <div className="fn">KRUSHY</div>
        <div className="ft">The home of the beautiful game.</div>
        <div className="fd"></div>
        <button className="cta" onClick={() => window.KJ.skip()}>Enter Store &rarr;</button>
      </div>
    </div>
  );
}
