'use client';
import Image from 'next/image';

export default function EndfieldProfileCard() {
  // shimmer svg แบบเบา ๆ สำหรับ blurDataURL
  const blur =
    'data:image/svg+xml;base64,' +
    btoa(
      `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='400' viewBox='0 0 700 400'>
        <defs>
          <linearGradient id='g'>
            <stop stop-color='#eef3f7' offset='20%'/>
            <stop stop-color='#f7fafc' offset='50%'/>
            <stop stop-color='#eef3f7' offset='80%'/>
          </linearGradient>
        </defs>
        <rect width='700' height='400' fill='#eef2f6'/>
        <rect id='r' width='700' height='400' fill='url(#g)'/>
        <animate xlink:href='#r' attributeName='x' from='-700' to='700' dur='1.2s' repeatCount='indefinite'/>
      </svg>`
    );

  return (
    <section className="ef-profile" aria-labelledby="schale-title">
      {/* ซ้าย: เนื้อหา/แท็ก */}
      <div className="left">
        <div className="eyebrow" aria-label="series">/// Blue Archive</div>
        <h2 id="schale-title" className="title">[ S.C.H.A.L.E ]</h2>

        <div className="copy" role="doc-introduction">
          <p><strong>Independent Federal Investigation Club</strong></p>
          <p>
            ชมรมสืบสวนกลางอิสระ SCHALE (連邦捜査部 SCHALE ) หรือเรียกง่ายๆ ว่าSCHALE (シャーレ)เป็นองค์กรวิสามัญฆาตกรรมและเป็นอิสระที่ก่อตั้งโดยประธานสภานักเรียนทั่วไป ผู้ลึกลับ ก่อนที่เธอจะหายตัวไป
          </p>
          <p>และที่นี่คือที่ที่เซนเซย์หรือคุณครูทำงาน</p>
        </div>

        {/* แกลเลอรีล่าง */}
        <div className="mini" role="list" aria-label="Character gallery">
          {MINIS.map((m) => (
            <div className="mini-item" role="listitem" key={m.t}>
              <button
                type="button"
                className="mini-btn"
                aria-label={m.t}
                // รองรับลิงก์จริงในอนาคต:
                // onClick={() => router.push(m.href)}
              >
                <Image
                  src={m.img}
                  alt={m.t}
                  width={300}
                  height={120}
                  sizes="(max-width: 991px) 100vw, 300px"
                  placeholder="blur"
                  blurDataURL={blur}
                />
                <span className="mini-title">{m.t}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ขวา: ภาพตัวละครใหญ่ */}
      <div className="right">
        <div className="hero" aria-hidden="true">
          <Image
            src="/images/sliders/SCHALE.jpg"
            alt="S.C.H.A.L.E emblem"
            fill
            priority
            sizes="(max-width: 1200px) 50vw, 600px"
            style={{ objectFit: 'contain' }}
            placeholder="blur"
            blurDataURL={blur}
          />
        </div>
      </div>

      <style jsx>{`
        .ef-profile{
          --g:#e3e6ea;
          --ink:#121417;
          --muted:#2b2f33;
          position:relative; display:grid; grid-template-columns: 1.15fr .85fr; gap: 24px;
          border:1px solid var(--g); border-radius:16px; background:#fff;
          padding: 22px 22px 12px; overflow:hidden;
          box-shadow: 0 12px 24px rgba(0,0,0,.08);
        }
        /* พื้นตารางจาง ๆ */
        .ef-profile::before{
          content:""; position:absolute; inset:0; pointer-events:none; opacity:.28;
          background:
            repeating-linear-gradient(0deg, rgba(0,0,0,.04) 0 1px, transparent 1px 32px),
            repeating-linear-gradient(90deg, rgba(0,0,0,.04) 0 1px, transparent 1px 32px);
        }

        .left{ position:relative; z-index:1; }
        .eyebrow{
          font-size:12px; letter-spacing:.24em; color:#333; opacity:.95; margin-bottom:6px; text-transform:uppercase;
        }
        .title{
          font-weight:900; font-size: clamp(22px, 3vw, 38px); margin:0 0 10px;
          padding-bottom:10px; border-bottom: 4px solid var(--bl,#02D3FB);
          color: var(--ink);
        }

        .copy p{
          color: var(--muted);
          line-height:1.8;
          margin: 0 0 10px;
        }

        /* mini gallery */
        .mini{ display:flex; gap:12px; margin-top:14px; flex-wrap:wrap; }
        .mini-item{ flex: 0 0 auto; width: 220px; }
        .mini-btn{
          position:relative; display:block; width:100%; border:1px solid var(--g);
          border-radius:12px; overflow:hidden; background:#fff; padding:0; cursor:pointer;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .mini-btn :global(img){ display:block; width:100%; height:auto; }
        .mini-btn:hover{
          transform: translateY(-3px) scale(1.02);
          border-color:#d7dce2;
          box-shadow: 0 10px 24px rgba(0,0,0,.12);
        }
        .mini-title{
          position:absolute; left:8px; bottom:8px; font-weight:800; font-size:13px;
          padding:4px 8px; border-radius:999px; background:linear-gradient(180deg,#fff,#f7f9fb);
          border:1px solid var(--g);
        }

        .right{ position:relative; }
        .hero{
          position:relative; width:100%; height:100%;
          min-height: 380px;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,.18));
          overflow:hidden; border-radius:12px;
        }
        .hero :global(img){
          transition: transform .5s ease;
        }
        .hero:hover :global(img){
          transform: scale(1.03);
        }

        @media (max-width: 991.98px){
          .ef-profile{ grid-template-columns:1fr; }
          .hero{ min-height: 320px; }
          .mini-item{ width: calc(50% - 6px); }
        }
        @media (max-width: 560px){
          .mini-item{ width: 100%; }
        }
      `}</style>
    </section>
  );
}

const MINIS = [
  { t:'01 / Sensei', img:'/images/sliders/sensei2.webp' },
  { t:'02 / Arona',  img:'/images/sliders/Arona.webp' },
  { t:'03 / Plana',  img:'/images/sliders/Plana.webp' },
  // { t:'04 / …', img:'/images/sliders/xxx.webp', href:'/characters/xxx' },
];
