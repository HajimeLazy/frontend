'use client';
import { useEffect, useRef } from 'react';
import Carousel from './components/carousel';
import Card from './components/card';
import './globals.css';

export default function Home() {
  const homeRef = useRef(null);
  const heroRef = useRef(null);

  /* Spotlight ตามเมาส์ (ไปผสมกับ .ak-yellow::after ที่คุณมีอยู่) */
  useEffect(() => {
    const el = homeRef.current ?? document.documentElement;
    const onMove = (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      el.style.setProperty('--mx', (e.clientX / w).toFixed(3));
      el.style.setProperty('--my', (e.clientY / h).toFixed(3));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  /* Reveal-on-scroll สำหรับส่วนล่าง */
  useEffect(() => {
    const root = homeRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={homeRef} className="ef-home ak-yellow">
      {/* ===== HERO (วิดีโอพื้นหลังวน เต็มหน้าจอจริง) ===== */}
      <section ref={heroRef} className="ef-hero" aria-label="Arknights: Endfield">
        <video
          className="ef-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/endfield/hero-poster.jpg"
        >
          <source src="/video/[Blue Archive] Official Promotion Video.mp4" type="video/mp4" />
        </video>

        {/* โครงพื้น + ท็อปเฟดกันกลืนกับ navbar */}
        <div className="ef-hero-overlay" aria-hidden />
        <div className="ef-hero-topfade" aria-hidden />


        {/* ไม่มีปุ่ม/เม็ดเหลืองกลางจออีกต่อไป */}
        <div className="ef-hero-center" />
        {/* cue เลื่อนลง (จาง ๆ) */}
        <a href="#trailer" className="ef-scroll-cue" aria-label="Scroll to trailer">
          <span className="ef-arrow" />
        </a>
      </section>

      {/* ===== CAROUSEL ===== */}
      <section id="trailer" className="container ef-section" data-reveal>
        <Carousel />
      </section>

      {/* ===== CARD / PROFILE ===== */}
      <section className="container ef-section" data-reveal>
        <Card />
      </section>

      <style jsx>{`
        .ef-home { position: relative; min-height: 100vh; }

        /* ระยะห่าง section ใต้ hero */
        .ef-section { padding: 40px 0; }
        #trailer{ scroll-margin-top: calc(var(--navH, 100px) + 12px); }

        /* HERO ให้กินเต็ม viewport จริง + อยู่ใต้ navbar */
        .ef-hero{
          position: relative;
          height: calc(100vh + var(--navH, 100px));
          display:flex; align-items:center; justify-content:center;
          margin-top: calc(var(--navH, 100px) * -1);
          padding-top: var(--navH, 100px);
          overflow: hidden;
          isolation: isolate;
        }
        .ef-hero-video{
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover;
          z-index:-3;
          pointer-events:none;
          transform: scale(1.02); /* กันขอบดำจอ ultra-wide */
        }

        /* ลายกริด + ไฮไลต์จาง ๆ (ไม่มีเม็ดเหลืองใด ๆ) */
        .ef-hero-overlay{
          position:absolute; inset:0; z-index:-2; pointer-events:none;
          background:
            linear-gradient(180deg, rgba(255,255,255,.00), rgba(255,255,255,.18)),
            repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 1px, transparent 1px 40px),
            repeating-linear-gradient(90deg, rgba(0,0,0,.06) 0 1px, transparent 1px 40px);
        }
        /* เฟดขาวด้านบนเพื่อไม่ให้ navbar กลืน */
        .ef-hero-topfade{
          position:absolute; left:0; right:0; top:0; height:120px;
          background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0));
          z-index:-1;
        }
        /* scanline บาง ๆ เพิ่มมิติ */
        .ef-hero-scanline{
          position:absolute; left:5%; right:5%; top:54%; height:2px; opacity:.35; pointer-events:none;
          background:repeating-linear-gradient(90deg,#cfd3d8 0 10px, transparent 10px 20px);
          animation: efSlide 6s linear infinite;
        }
        @keyframes efSlide{ from{ background-position:0 0 } to{ background-position:-400px 0 } }

        .ef-hero-center{ text-align:center; color:#111; padding: 0 16px; }

        /* cue ให้รู้ว่ามีคอนเทนต์ด้านล่าง (เล็ก จาง ไม่รบกวน) */
        .ef-scroll-cue{
          position:absolute; left:50%; bottom:22px; transform:translateX(-50%);
          width:28px; height:44px; border-radius:20px;
          border:1px solid rgba(0,0,0,.28);
          display:flex; align-items:flex-start; justify-content:center;
          text-decoration:none; opacity:.6;
          transition: opacity .2s ease, transform .2s ease;
        }
        .ef-scroll-cue:hover{ opacity:.9; transform:translateX(-50%) translateY(-2px); }
        .ef-arrow{
          width:6px; height:10px; margin-top:8px; border-radius:3px;
          background:#111; opacity:.55; animation: efDrop 1.2s infinite ease-in-out;
        }
        @keyframes efDrop{
          0%{ transform: translateY(0); opacity:.55 }
          70%{ transform: translateY(14px); opacity:.0 }
          100%{ transform: translateY(0); opacity:.55 }
        }

        /* Reveal on scroll */
        [data-reveal]{ opacity:0; transform:translateY(18px); transition:opacity .6s ease, transform .6s ease; }
        .reveal-in{ opacity:1; transform:none; }

        @media (max-width: 991.98px){
          .ef-hero{
            height: calc(100vh + var(--navH, 76px));
            margin-top: calc(var(--navH, 76px) * -1);
            padding-top: var(--navH, 76px);
          }
        }
        @media (prefers-reduced-motion: reduce){
          .ef-hero-video{ transform:none; }
          .ef-hero-scanline, .ef-arrow{ animation: none; }
        }
      `}</style>
    </div>
  );
}
