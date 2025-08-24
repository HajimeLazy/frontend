'use client';
import Image from 'next/image';

export default function EndfieldProfileCard() {
  return (
    <div className="ef-profile">
      {/* ซ้าย: เนื้อหา/แท็ก */}
      <div className="left">
        <div className="eyebrow">/// ARKNIGHTS: ENDFIELD</div>
        <h2 className="title">[ Endministrator ]</h2>

        <div className="meta">
          <div className="group">
            <span className="label">FACTION</span>
            <span className="pill">Endfield Industries</span>
          </div>
          <div className="group">
            <span className="label">RACE</span>
            <span className="pill">[data_missing]</span>
          </div>
        </div>

        <div className="copy">
          <p>
            Other factions within the Civilization Band are well aware that Endfield
            has a very special trump card in their hand, but that is all they know.
          </p>
          <p>
            The Endministrator's mysterious mastery over Originium and the Protocol network,
            along with the Endmin's need for periodic long-term hibernation, is one of Endfield's most important secrets.
          </p>
        </div>

        {/* แกลเลอรีล่าง */}
        <div className="mini">
          {MINIS.map((m) => (
            <a className="mini-item" href="#" key={m.t}>
              <Image src={m.img} alt="" width={300} height={120} />
              <span className="mini-title">{m.t}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ขวา: ภาพตัวละครใหญ่ */}
      <div className="right">
        <div className="hero">
          <Image
            src="/images/sliders/Endministrator.webp"
            alt="Endministrator"
            fill
            priority
            sizes="(max-width: 1200px) 50vw, 600px"
            style={{objectFit:'contain'}}
          />
        </div>
      </div>

      <style jsx>{`
        .ef-profile{
          --g:#e3e6ea;
          position:relative; display:grid; grid-template-columns: 1.15fr .85fr; gap: 24px;
          border:1px solid var(--g); border-radius:16px; background:#fff;
          padding: 22px 22px 12px; overflow:hidden;
          box-shadow: 0 12px 24px rgba(0,0,0,.08);
        }
        /* พื้นตารางจาง ๆ */
        .ef-profile::before{
          content:""; position:absolute; inset:0; pointer-events:none; opacity:.35;
          background:
            repeating-linear-gradient(0deg, rgba(0,0,0,.04) 0 1px, transparent 1px 32px),
            repeating-linear-gradient(90deg, rgba(0,0,0,.04) 0 1px, transparent 1px 32px);
        }

        .left{ position:relative; z-index:1; }
        .eyebrow{ font-size:12px; letter-spacing:.24em; color:#444; opacity:.85; margin-bottom:6px; }
        .title{
          font-weight:900; font-size: clamp(22px, 3vw, 38px); margin:0 0 10px;
          padding-bottom:10px; border-bottom: 4px solid var(--yl,#ffe500);
        }

        .meta{ display:flex; gap:18px; flex-wrap:wrap; margin: 10px 0 10px; }
        .group{ display:flex; align-items:center; gap:10px; }
        .label{
          font-size:12px; letter-spacing:.18em; color:#222; background:#fffbe6;
          border:1px solid #e8d66b; padding:4px 10px; border-radius:999px; font-weight:800;
        }
        .pill{
          border:1px solid var(--g); padding:4px 10px; border-radius:999px;
          background:#fff; color:#111; font-weight:700;
        }

        .copy p{ color:#222; line-height:1.7; margin: 0 0 10px; }

        .mini{ display:flex; gap:12px; margin-top:14px; flex-wrap:wrap; }
        .mini-item{
          position:relative; border:1px solid var(--g); border-radius:12px; overflow:hidden;
          background:#fff; width: 220px; flex: 0 0 auto;
        }
        .mini-item :global(img){ display:block; width:100%; height:auto; }
        .mini-title{
          position:absolute; left:8px; bottom:8px; font-weight:800; font-size:13px;
          padding:4px 8px; border-radius:999px; background:linear-gradient(180deg,#fff,#f7f9fb);
          border:1px solid var(--g);
        }

        .right{ position:relative; }
        .hero{
          position:relative; width:100%; height:100%;
          min-height: 380px; /* ให้ภาพสูงแบบในภาพ */
          filter: drop-shadow(0 12px 24px rgba(0,0,0,.18));
        }

        @media (max-width: 991.98px){
          .ef-profile{ grid-template-columns:1fr; }
          .hero{ min-height: 320px; }
        }
      `}</style>
    </div>
  );
}

const MINIS = [
  { t:'01 / Endministrator', img:'/images/sliders/Endministrator.webp' },
  { t:'02 / Endministrator',         img:'/images/sliders/41903-2128533063.png' },
  { t:'03 /perlica',          img:'/images/sliders/perlica-assets-info-from-website-v0-6omzyh2vfaxb1.webp' },
];
