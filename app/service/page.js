"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-kanit",
});

export default function ServicePage() {
  const rootRef = useRef(null);
  const revealRoot = useRef(null);
  const canvasRef = useRef(null);
  const mediaRef = useRef(null);
  const [lightbox, setLightbox] = useState(false);

  // Tabs ------------------------------------------------------------
  const TABS = useMemo(
    () => [
      {
        key: "Kivotos",
        label: "คิโวทอส",
        desc: "เมืองการศึกษาที่รวมหลายสถาบัน",
        thumb: "/images/sliders/kivotos.webp",
      },
      {
        key: "SynergyInfo",
        label: "SynergyInfo",
        desc: "บทบาท-ตำแหน่ง ผสมทีมยังไงให้แรง",
        // ถ้าไฟล์คุณยังชื่อ "synergy info.webp" ที่มีช่องว่าง ให้รีเนมเป็น synergy-info.webp
        thumb: "/images/sliders/synergyinfo.jpg",
      },
      {
        key: "Club",
        label: "ชมรม",
        desc: "ระบบชมรม ความสามารถ และกิจกรรม",
        thumb: "/images/sliders/Club.webp",
      },
      {
        key: "Gameplay",
        label: "เกมเพลย์",
        desc: "ต่อสู้ เควสต์ และการพัฒนา",
        thumb: "/images/sliders/gameplay.jpg",
      },
    ],
    []
  );

  const [tab, setTab] = useState(TABS[3].key); // default: Gameplay
  const [imgErr, setImgErr] = useState(false);

  // สร้าง map ของรูปตาม key (ไม่มี type assertion)
  const GP_IMAGES = useMemo(() => {
    return TABS.reduce((acc, t) => {
      acc[t.key] = t.thumb;
      return acc;
    }, {});
  }, [TABS]);

  const mediaSrc = GP_IMAGES[tab];

  /* ----------------- Reveal on scroll (stagger) ----------------- */
  useEffect(() => {
    const root = revealRoot.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ----------------- Mouse spotlight (พื้นหลังทั้งหน้า) ----------------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let rafId = 0,
      px = 0.5,
      py = 0.3,
      tx = px,
      ty = py;
    const loop = () => {
      tx += (px - tx) * 0.12;
      ty += (py - ty) * 0.12;
      el.style.setProperty("--mx", String(tx));
      el.style.setProperty("--my", String(ty));
      rafId = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ----------------- 3D tilt & swap animation ----------------- */
  useEffect(() => {
    const frame = mediaRef.current?.querySelector(".media-frame");
    if (!frame) return;
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      raf = 0;
    const loop = () => {
      tx += (rx - tx) * 0.15;
      ty += (ry - ty) * 0.15;
      frame.style.setProperty("--rx", `${tx.toFixed(2)}deg`);
      frame.style.setProperty("--ry", `${ty.toFixed(2)}deg`);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      const r = frame.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      ry = nx * 10; // rotateY
      rx = -ny * 8; // rotateX
    };
    const reset = () => {
      rx = 0;
      ry = 0;
    };
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", reset);
    raf = requestAnimationFrame(loop);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, [tab]);

  /* ----------------- ปุ่ม: แสงแม่เหล็กตามเมาส์ ----------------- */
  useEffect(() => {
    const btns = Array.from(document.querySelectorAll(".btn-ef"));
    const move = (e) => {
      const b = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - b.left) / b.width) * 100;
      const y = ((e.clientY - b.top) / b.height) * 100;
      e.currentTarget.style.setProperty("--hx", `${x}%`);
      e.currentTarget.style.setProperty("--hy", `${y}%`);
    };
    const leave = (e) => {
      e.currentTarget.style.removeProperty("--hx");
      e.currentTarget.style.removeProperty("--hy");
    };
    btns.forEach((b) => {
      b.addEventListener("pointermove", move);
      b.addEventListener("pointerleave", leave);
    });
    return () =>
      btns.forEach((b) => {
        b.removeEventListener("pointermove", move);
        b.removeEventListener("pointerleave", leave);
      });
  }, []);

  /* ----------------- Lightbox escape ----------------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={rootRef} className={`service-screen ef-light ${kanit.variable}`}>
      {/* BG layers */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/videos/endfield-hero.mp4" type="video/mp4" />
      </video>
      <canvas ref={canvasRef} className="fx-canvas" aria-hidden />

      {/* HERO */}
      <header className="hero container">
        <div className="brand-row" data-r="1">
          <div className="logo">
            <span></span>
          </div>
          <div className="topo">Blue Archive</div>
        </div>

        <h1 className="hero-title" data-r="2">Gameplay & Service</h1>
        <p className="hero-sub" data-r="3">
          แนะแนวการเล่น • ระบบฐาน • ชมรม • เนื้อเรื่อง • วีดิโอแนะนำ
        </p>

        <div className="cta-row" data-r="4">
          <a className="btn-ef btn-yl" href="#gameplay">แนะนำเกม</a>
          <a className="btn-ef btn-outline" href="#video">ดูวิดีโอ</a>
        </div>

        <div className="hero-scanline" />
        <div className="hero-slope" />
      </header>

      <main ref={revealRoot}>
        {/* GAMEPLAY */}
        <section id="gameplay" className="container gameplay" data-reveal>
          <div className="gp-text">
            <div className="section-eyebrow">NEXON</div>
            <h2 className="section-title">BLUE ARCHIVE</h2>
            <p className="section-desc">
              Blue Archive ( 블루 아카이브 )เป็นเกม RPG วางแผนแบบเรียลไทม์
              ชีวิตในโรงเรียน การต่อสู้ มิตรภาพ และพันธะสัญญาที่มีให้กัน
              เกิดเป็นเรื่องราวที่ก้องกังวานอยู่ในใจใน Blue Archive
              คุณจะได้รับการแต่งตั้งให้เป็นคุณครูที่ปรึกษาของชมรมสอบสวน ชาเล่ต์
              ภายในเมืองคิโวทอส เมืองแห่งการศึกษาขนาดใหญ่ที่มีโรงเรียนรวมกันอยู่จำนวนมาก
              ร่วมต่อสู้ในการผจญภัยเพื่อคลี่คลายปมปริศนาของเหตุการณ์ต่างๆ
              ในเมืองคิโวทอสไปกับเหล่านักเรียนสาวน่ารักจากหลากหลายโรงเรียน
              ราวกับอยู่ในเรื่องราวของอนิเมะ
            </p>

            {/* Tab cards */}
            <div className="tabcards" role="tablist" aria-label="Blue Archive topics">
              {TABS.map((t, i) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`tabcard ${active ? "active" : ""}`}
                    style={{ "--i": i }}
                    onClick={() => { setTab(t.key); setImgErr(false); }}
                  >
                    <span className="thumb">
                      <Image
                        src={t.thumb}
                        alt=""
                        fill
                        sizes="96px"
                        style={{ objectFit: "cover" }}
                        onError={() => {}}
                      />
                    </span>
                    <span className="meta">
                      <span className="label">{t.label}</span>
                      <span className="desc">{t.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MEDIA */}
          <div className="gp-media" ref={mediaRef}>
            <div
              className={`media-frame ${imgErr ? "is-placeholder" : ""}`}
              onClick={() => !imgErr && setLightbox(true)}
              title={!imgErr ? "คลิกเพื่อขยาย" : ""}
            >
              {!imgErr ? (
                <div className="media-swap" key={tab}>
                  <Image
                    src={mediaSrc}
                    alt={`ภาพประกอบ: ${tab}`}
                    fill
                    className="media-img"
                    sizes="(max-width: 992px) 100vw, 58vw"
                    priority
                    onError={() => setImgErr(true)}
                  />
                  <div className="media-scan" aria-hidden />
                </div>
              ) : (
                <div className="media-fallback" />
              )}
              <span className="media-hint">คลิกเพื่อขยาย</span>
            </div>
            <div className="media-line" aria-hidden />
            <div className="media-foot" />
          </div>
        </section>

        {/* VIDEO */}
        <section id="video" className="container video" data-reveal>
          <div className="video-wrap">
            <iframe
              src="https://www.youtube.com/embed/kRA6ON0Oxro?si=NL6SS5pUXO6YODCX"
              title="Arknights: Endfield Gameplay"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="origin"
              allowFullScreen
            />
          </div>
        </section>

        {/* MODULES (ซ่อนเมื่อว่าง) */}
        {MODULES.length > 0 && (
          <section className="container modules reveal-in" data-reveal>
            {MODULES.map((m, idx) => (
              <article className="mod" key={m.title} style={{ "--rd": `${idx * 90}ms` }}>
                <div className="mod-head">
                  <span className="dot" />
                  <h3>{m.title}</h3>
                </div>
                <p className="mod-desc">{m.desc}</p>
                <ul className="mod-list">
                  {m.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <a href="#" className="mod-link">รายละเอียด</a>
              </article>
            ))}
          </section>
        )}

        {/* CTA */}
        <section className="container cta" data-reveal>
          <div className="cta-card">
            <div>
              <h3>คุณครูพร้อมรึยังคะ?</h3>
              <p className="muted"></p>
            </div>
            <a className="btn-ef btn-yl" href="https://bluearchive.nexon.com/home">ดาวน์โหลด</a>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div className="lb" onClick={() => setLightbox(false)}>
          <img src={mediaSrc} alt="" />
        </div>
      )}

      {/* ---------- CSS (แทบเดิม + ส่วน tabcards ใหม่) ---------- */}
      <style jsx>{`
        :root {
          --yl: #90edffff;
          --yl2: #02D3FB;
          --ink: #101214;
          --ink2: #2b2f33;
          --stroke: #e3e6ea;
          --bg: #f6f7f8;
          --bg2: #f1f3f5;
        }
        .ef-light { --grid: rgba(0,0,0,0.06); color: var(--ink); position: relative; }
        .ef-light::before {
          content: ""; position: fixed; inset: 0; z-index: -2;
          background:
            radial-gradient(1000px 500px at 20% 0%, rgba(255,229,0,0.1), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.25)),
            repeating-linear-gradient(0deg, var(--grid) 0 1px, transparent 1px 40px),
            repeating-linear-gradient(90deg, var(--grid) 0 1px, transparent 1px 40px),
            linear-gradient(145deg, var(--bg), var(--bg2));
        }
        .ef-light::after {
          content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
          background: radial-gradient(220px 160px at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.3) * 100%), rgba(255,255,255,0.2), rgba(255,255,255,0));
          mix-blend-mode: overlay;
        }

        .bg-video { position: fixed; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .1; z-index:-3; }
        .fx-canvas { position: fixed; inset: 0; z-index:-1; pointer-events:none; }
        .service-screen { min-height: 100vh; overflow-x: hidden; font-family: var(--font-kanit), system-ui, -apple-system; }
        .container { width: min(1200px, 92%); margin: 0 auto; position: relative; z-index: 1; }

        .hero { padding-top: 110px; padding-bottom: 60px; text-align: center; position: relative; }
        .brand-row { display:flex; align-items:center; justify-content:space-between; }
        .logo { font-weight: 800; font-size: 26px; letter-spacing: .06em; }
        .logo span { background: linear-gradient(180deg, var(--yl), var(--yl2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-size:200% 200%; animation: shine 6s ease-in-out infinite; }
        @keyframes shine { 0%,100%{background-position:0% 0%} 50%{background-position:100% 100%} }
        .topo { font-size:12px; letter-spacing:.2em; color:var(--ink2); opacity:.8; text-transform:uppercase; }
        .hero-title { margin: 18px auto 6px; font-size: clamp(28px, 6vw, 64px); font-weight: 800; letter-spacing: .04em; color: var(--ink); text-shadow: 0 0 8px rgba(150,246,255,.18); }
        .hero-sub { color: var(--ink2); opacity: .92; }
        .cta-row { display:flex; gap:12px; justify-content:center; margin-top:18px; }

        .hero [data-r] { opacity:0; transform: translateY(8px); animation: rise .6s cubic-bezier(.2,.7,.2,1) forwards; }
        .hero [data-r="1"]{ animation-delay:.05s }
        .hero [data-r="2"]{ animation-delay:.18s }
        .hero [data-r="3"]{ animation-delay:.3s }
        .hero [data-r="4"]{ animation-delay:.42s }
        @keyframes rise { to { opacity:1; transform:none } }

        .btn-ef { position:relative; overflow:hidden; padding:12px 28px; border-radius:999px; font-weight:800; letter-spacing:.06em; border:1px solid transparent; text-decoration:none; display:inline-flex; align-items:center; gap:8px; text-transform:uppercase; }
        .btn-yl { background: linear-gradient(180deg, var(--yl), var(--yl2)); color:#111; box-shadow: 0 6px 18px rgba(0,0,0,.12); }
        .btn-yl:hover { filter: brightness(1.04); }
        .btn-outline { border-color:var(--stroke); color:var(--ink); background:#fff; }
        .btn-outline:hover { background:#fff; filter: brightness(1.02); }
        .btn-ef::after { content:""; position:absolute; inset:-25%; background: radial-gradient(160px 160px at var(--hx,50%) var(--hy,50%), rgba(255,255,255,.38), rgba(255,255,255,0) 60%); mix-blend-mode: screen; opacity:0; transition: opacity .2s; pointer-events:none; }
        .btn-ef:hover::after { opacity:1; }

        .gameplay { display:grid; grid-template-columns: 1fr 1.35fr; gap:28px; align-items:center; padding:70px 0; }
        .section-eyebrow { font-size:12px; letter-spacing:.24em; color:var(--ink2); opacity:.75; margin-bottom:8px; text-transform:uppercase; }
        .section-title { font-size: clamp(24px, 4vw, 46px); font-weight: 800; color: var(--ink); margin:0 0 8px; }
        .section-desc { color: var(--ink2); line-height: 1.65; }

        .gp-text > * { opacity:0; transform: translateY(10px); transition: opacity .5s ease, transform .5s ease; }
        .gameplay.reveal-in .gp-text > * { opacity:1; transform:none; }
        .gp-text > *:nth-child(1){ transition-delay:.05s }
        .gp-text > *:nth-child(2){ transition-delay:.12s }
        .gp-text > *:nth-child(3){ transition-delay:.2s }
        .gp-text > *:nth-child(4){ transition-delay:.3s }

        /* NEW: Tab cards */
        .tabcards {
          display:grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
        }
        @media (min-width: 720px){
          .tabcards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        .tabcard {
          --i: 0;
          position: relative;
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px;
          border-radius: 14px;
          border:1px solid var(--stroke);
          background:#fff;
          cursor:pointer;
          opacity:0;
          transform: translateY(10px);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
        }
        .gameplay.reveal-in .tabcard { opacity:1; transform:none; transition-delay: calc(var(--i) * 70ms); }
        .tabcard:hover { transform: translateY(-2px); border-color:#dbe0e6; box-shadow: 0 8px 18px rgba(0,0,0,.08); }
        .tabcard.active { border-color:#bfefff; box-shadow: 0 10px 24px rgba(0,0,0,.1), inset 0 0 0 1px rgba(2,211,251,.22); background: linear-gradient(180deg,#ffffff,#f9fcff); }

        .thumb { position: relative; width: 56px; height: 56px; border-radius: 12px; overflow: hidden; flex: 0 0 auto; background:#f2f5f7; }
        .meta { display:flex; flex-direction:column; min-width:0; }
        .label { font-weight: 800; font-size: 14px; color:#111; line-height:1.2; }
        .desc { font-size: 12px; color:#4a5158; opacity:.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .gp-media { position: relative; width: 100%; justify-self: end; }
        .media-frame {
          --rx: 0deg; --ry: 0deg;
          position: relative; width:100%; aspect-ratio:16/9; border-radius:16px; overflow:hidden;
          border:1px solid var(--stroke); box-shadow: 0 10px 24px rgba(0,0,0,.12);
          transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(calc((1 - var(--imv, 0)) * 20px)) scale(calc(1.05 - var(--imv, 0) * 0.05));
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          cursor: zoom-in; background:#f5f6f7;
        }
        .media-frame:hover { box-shadow: 0 18px 40px rgba(0,0,0,.16); border-color:#dbe0e6; }
        .media-swap { position:absolute; inset:0; animation: imgReveal .6s cubic-bezier(.2,.8,.2,1) both; }
        .media-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .media-scan { position:absolute; left:-20%; right:-20%; top:0; bottom:0; background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.28) 50%, rgba(255,255,255,0) 100%); transform: translateY(-100%); animation: scanDown .7s ease .1s both; mix-blend-mode: screen; pointer-events:none; }
        @keyframes imgReveal { from { opacity:0; transform: translateY(8px) scale(1.02); clip-path: inset(20% 0 0 0 round 16px);} to { opacity:1; transform:none; clip-path: inset(0 0 0 0 round 16px);} }
        @keyframes scanDown { from { transform: translateY(-100%);} to { transform: translateY(100%);} }

        .media-fallback { position:absolute; inset:0; background: linear-gradient(135deg,#f5f6f7,#eceff2); }
        .media-hint { position:absolute; right:10px; bottom:10px; padding:4px 8px; font-size:11px; border-radius:999px; background: rgba(142,237,246,.75); border:1px solid var(--stroke); color:#a9ecf9ff; }
        .media-line { position:absolute; top:50%; left:-24px; right:-24px; height:2px; z-index:-1; background: repeating-linear-gradient(90deg,#cfd3d8 0 10px, transparent 10px 20px); opacity:.55; transform: translateY(-50%); pointer-events:none; }
        .media-foot { position:absolute; right:0; bottom:-10px; width:22px; height:22px; background:#fff; border:1px solid var(--stroke); z-index:1; }

        .video { padding: 40px 0 20px; }
        .video-wrap { position:relative; width:100%; aspect-ratio:16/9; border:1px solid var(--stroke); border-radius:14px; overflow:hidden; background:#fff; box-shadow:0 10px 24px rgba(0,0,0,.12); }
        .video-wrap iframe { position:absolute; inset:0; width:100%; height:100%; }

        .modules { display:grid; grid-template-columns: repeat(3, 1fr); gap:18px; padding:40px 0; }
        .mod { background:#91edffff; border:1px solid #02d3fb; border-radius:16px; padding:16px; box-shadow: inset 0 0 0 1px rgba(185,158,0,.18); transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease, opacity .5s ease var(--rd, 0ms), transform .5s ease var(--rd, 0ms); opacity:0; transform: translateY(12px); }
        .modules.reveal-in .mod { opacity:1; transform:none; }
        .mod:hover { transform: translateY(-4px); border-color:#02d3fb; box-shadow: 0 16px 30px rgba(0,0,0,.12), inset 0 0 0 1px rgba(187,224,251,.28); }
        .mod-head { display:flex; align-items:center; gap:8px; }
        .dot { width:10px; height:10px; border-radius:50%; background:var(--yl2); box-shadow:0 0 10px rgba(189,239,255,.55); }
        .mod h3 { margin:0; font-size:20px; color:#111; }
        .mod-desc { color:#222; margin:.45rem 0 .6rem; }
        .mod-list { margin:0 0 .8rem 1.2rem; color:#222; }
        .mod-link { color:#111; background: linear-gradient(180deg, var(--yl), var(--yl2)); padding:.45rem .8rem; border-radius:999px; text-decoration:none; font-weight:800; box-shadow:0 0 12px rgba(0,0,0,.12); text-transform:uppercase; letter-spacing:.06em; }

        .cta { padding:30px 0 70px; }
        .cta-card { display:flex; align-items:center; justify-content:space-between; gap:16px; background: linear-gradient(180deg,#ffffff,#f9fafb); border:1px solid var(--stroke); border-radius:16px; padding:18px 20px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.03); }
        .muted { color:#daf4ffff; }

        [data-reveal] { opacity:0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
        .reveal-in { opacity:1; transform: translateY(0); }

        .lb { position:fixed; inset:0; background: rgba(0,0,0,.78); display:flex; align-items:center; justify-content:center; z-index:9999; animation: lbIn .18s ease; }
        .lb img { max-width: min(96vw, 1400px); max-height: 86vh; border-radius:14px; box-shadow: 0 18px 50px rgba(0,0,0,.5); transform: scale(.98); animation: pop .22s cubic-bezier(.2,.8,.2,1) forwards; }
        @keyframes pop { to { transform: scale(1); } }
        @keyframes lbIn { from { background: rgba(0,0,0,0); } }

        @media (max-width: 992px) {
          .gameplay { grid-template-columns: 1fr; }
          .modules { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .modules { grid-template-columns: 1fr; }
          .brand-row { flex-direction: column; gap: 6px; }
        }
      `}</style>
    </div>
  );
}

// ว่างไว้ได้ โค้ดจะซ่อน section ให้เองถ้าไม่มีข้อมูล
const MODULES = [];
