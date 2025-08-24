'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: ต่อ API ส่งข้อความจริงที่นี่
    setSent(true)
    e.currentTarget.reset()
    const t = setTimeout(() => setSent(false), 4000)
    // กัน memory leak เวลาเปลี่ยนหน้าเร็ว ๆ
    return () => clearTimeout(t)
  }

  return (
    <div className="ba-shell">
      <header className="ba-hero">
        <h1>About & Contact</h1>
        <p className="sub">แฟนไซต์ Blue Archive • คำแนะนำ ติดต่อ และข้อเสนอแนะ</p>
      </header>

      <main className="container">
        <div className="grid">
          {/* ABOUT / QUICK INFO */}
          <section className="ba-card about">
            <h2 className="eyebrow">เกี่ยวกับเว็บ</h2>
            <p>
              เว็บไซต์นี้เป็นแฟนไซต์สำหรับ <strong>Blue Archive</strong> ทำขึ้นเพื่อรวมข้อมูลการเล่น
              ข้อมูลสั้น ๆ และลิงก์มีประโยชน์ต่าง ๆ เป้าหมายคือให้เซนเซย์หาอะไรที่ต้องการได้ไวขึ้น
              โค้ดรันบน <code>Next.js</code> + <code>Bootstrap</code> เน้นโหลดไวและอ่านง่าย
            </p>

            <div className="info">
              <div className="info-item">
                <i className="bi bi-lightning-charge-fill" />
                <div>
                  <b>อัปเดตเป็นช่วง ๆ</b>
                  <span>สรุปแพตช์/กิจกรรม แบบกระชับ</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bi bi-collection-play-fill" />
                <div>
                  <b>คู่มือย่อย</b>
                  <span>พื้นฐาน, ทีม, เคล็ดลับบอส</span>
                </div>
              </div>
              <div className="info-item">
                <i className="bi bi-heart-fill" />
                <div>
                  <b>ชุมชนแฟน ๆ</b>
                  <span>รับฟีดแบ็กเพื่อทำให้ดีขึ้น</span>
                </div>
              </div>
            </div>

            <div className="contact-links">
              <a className="chip" href="https://mail.google.com/" aria-disabled="false">
                <i className="bi bi-envelope-fill" /> อีเมล
              </a>
              <a className="chip" href="https://discord.com/invite/bluearchiveglobal" aria-disabled="false">
                <i className="bi bi-discord" /> Discord
              </a>
              <a className="chip" href="https://x.com/en_bluearchive" aria-disabled="false">
                <i className="bi bi-twitter-x" /> X / Twitter
              </a>
            </div>

            <div className="faq">
              <details>
                <summary>จะอัปเดตอะไรบ้าง?</summary>
                <p>สรุปอีเวนต์, ตัวละครใหม่, และแนวทางทีมพื้นฐานเป็นหลัก</p>
              </details>
              <details>
                <summary>ส่งฟีดแบ็กอย่างไร?</summary>
                <p>กรอกฟอร์มฝั่งขวา หรืออีเมลมาที่ <a href="https://mail.google.com">tatath214@gmail.com</a></p>
              </details>
              <details>
                <summary>ลบ/แก้ไขข้อความที่ส่งไว้ได้ไหม?</summary>
                <p>ระบุอีเมลเดิมแล้วแจ้งคำขอ เราจะช่วยจัดการให้</p>
              </details>
            </div>
          </section>

          {/* CONTACT FORM */}
          <section className="ba-card">
            <h2 className="eyebrow">ติดต่อเรา</h2>
            {sent && (
              <div className="alert success" role="status">
                ขอบคุณค่ะ! ข้อความถูกส่งแล้ว
              </div>
            )}
            <form onSubmit={handleSubmit} className="form">
              <div className="row">
                <div className="col">
                  <label htmlFor="name">ชื่อ</label>
                  <input id="name" name="name" type="text" required placeholder="กรอกชื่อของคุณ" />
                </div>
                <div className="col">
                  <label htmlFor="email">อีเมล</label>
                  <input id="email" name="email" type="email" required placeholder="name@example.com" />
                </div>
              </div>

              <div className="row">
                <div className="col full">
                  <label htmlFor="message">ข้อความ</label>
                  <textarea id="message" name="message" rows="4" required placeholder="เขียนข้อความของคุณที่นี่" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-100">
                ส่งข้อความ
              </button>
            </form>
            <div className="back-home">
              <Link href="/" className="home-link">← กลับหน้าหลัก</Link>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .ba-shell{
          --ba:#02D3FB;          /* ฟ้าไฮไลต์ */
          --ba2:#8FE5F7;         /* ฟ้าอ่อน */
          --ink:#101214;
          --muted:#475569;
          --stroke:#e5edf3;
          --card:#ffffff;
          background:
            linear-gradient(180deg,#f7fcff 0%, #f0f7fb 100%);
          min-height:100vh;
        }
        .ba-hero{
          padding: 92px 16px 18px;
          text-align:center;
        }
        .ba-hero h1{
          margin:0 0 6px;
          font-weight:900;
          letter-spacing:.02em;
          background: linear-gradient(180deg, #0d2b3a, #0f3a4d);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          font-size: clamp(26px, 5vw, 44px);
        }
        .ba-hero .sub{
          color: var(--muted);
        }

        .container{
          width:min(1100px, 92%);
          margin: 0 auto 36px;
        }
        .grid{
          display:grid;
          grid-template-columns: 1.1fr 1fr;
          gap:18px;
        }
        @media (max-width: 900px){
          .grid{ grid-template-columns: 1fr; }
        }

        .ba-card{
          background: var(--card);
          border:1px solid var(--stroke);
          border-radius:16px;
          padding:18px;
          box-shadow: 0 10px 24px rgba(2, 211, 251, .06);
          position:relative;
          overflow:hidden;
        }
        .ba-card::before{
          content:"";
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(600px 280px at 16% -8%, rgba(2,211,251,.10), transparent 60%),
            repeating-linear-gradient(0deg, rgba(0,0,0,.035) 0 1px, transparent 1px 28px);
          opacity:.7;
        }
        .ba-card > *{ position:relative; z-index:1; }

        .eyebrow{
          font-size:12px;
          letter-spacing:.24em;
          text-transform:uppercase;
          color:#0f3a4d;
          opacity:.8;
          margin:0 0 8px;
        }

        .about p{ color:#1f2937; line-height:1.65; }
        .info{ display:grid; gap:10px; margin:14px 0; }
        .info-item{
          display:flex; gap:10px; align-items:flex-start;
          padding:10px; border:1px solid var(--stroke); border-radius:12px; background:#fff;
        }
        .info-item i{ color: var(--ba); }
        .info-item b{ display:block; }
        .info-item span{ color:var(--muted); font-size:13px }

        .contact-links{ display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
        .chip{
          display:inline-flex; align-items:center; gap:6px;
          padding:8px 12px; border-radius:999px;
          border:1px solid var(--stroke); background:#fff; color:#0b2a3a; text-decoration:none;
        }
        .chip[aria-disabled="true"]{ opacity:.6; cursor:not-allowed }

        .faq{ margin-top:14px; }
        .faq details{
          border:1px solid var(--stroke); background:#fff; border-radius:12px; padding:10px 12px; margin-bottom:8px;
        }
        .faq summary{ cursor:pointer; font-weight:600; }
        .faq p{ margin:.5rem 0 0; color:#1f2937; }

        .form{ display:flex; flex-direction:column; gap:12px; }
        .row{ display:flex; gap:12px; }
        .col{ flex:1; display:flex; flex-direction:column; gap:6px; }
        .col.full{ flex: 1 1 100%; }
        @media (max-width: 600px){ .row{ flex-direction:column; } }

        label{ font-size:13px; color:#0f3a4d; font-weight:700; }
        input, textarea{
          width:100%; border:1px solid var(--stroke); border-radius:12px;
          padding:12px 14px; font-size:14px; background:#fff; color:var(--ink);
          outline:none; transition: box-shadow .15s ease, border-color .15s ease;
        }
        input:focus, textarea:focus{
          border-color: var(--ba);
          box-shadow: 0 0 0 4px rgba(2,211,251,.15);
        }

        .btn-primary{
          display:inline-flex; align-items:center; justify-content:center;
          border:none; border-radius:999px; padding:12px 18px;
          background: linear-gradient(180deg, var(--ba2), var(--ba));
          color:#0b2a3a; font-weight:900; letter-spacing:.04em; text-transform:uppercase;
          box-shadow: 0 8px 22px rgba(2,211,251,.25);
        }
        .btn-primary:hover{ filter:brightness(1.04); }

        .w-100{ width:100%; }

        .alert{
          border-radius:12px; padding:10px 12px; margin-bottom:8px; font-weight:600;
          border:1px solid var(--stroke);
        }
        .alert.success{
          background: linear-gradient(180deg, #ecfeff, #e6fbff);
          border-color: rgba(2,211,251,.35);
          color:#064e63;
        }

        .back-home{ margin-top:10px; text-align:center; }
        .home-link{ color:#0f3a4d; text-decoration:none; }
        .home-link:hover{ text-decoration:underline; }
      `}</style>
    </div>
  )
}
