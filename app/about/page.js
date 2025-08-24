'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  // ====== ปรับข้อมูลส่วนตัวตรงนี้ ======
  const PROFILE = {
    nameTh: 'กิตติคุณ ชูบุญ 001',
    role: 'นักศึกษา IT | Frontend Dev | Graphic',
    tagline: 'ชอบทำเว็บธีมเกม/อนิเมะแนว Neon-UI, สนุกกับการออกแบบ UX ที่ลื่นไหล',
    avatar: '/images/sliders/Profile.jfif', // เปลี่ยนเป็นรูปตัวเอง/โลโก้
    location: 'เชียงใหม่, ไทย',
    email: 'tatath214@gmail.com',
    phone: '088-253-0818',
    lineId: '2549tata',
    website: '001-frontend-rho.vercel.app',
    resumeUrl: '/files/Resume-YourName.pdf', // ใส่ไฟล์เรซูเม่ใน public/files
  };

  const SOCIALS = [
    { href: 'https://www.facebook.com/tata.785833/', icon: 'bi-facebook', label: 'Facebook' },
    { href: 'https://www.instagram.com/tata0.w0/', icon: 'bi-instagram', label: 'Instagram' },
    { href: 'https://github.com/HajimeLazy', icon: 'bi-github', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/your', icon: 'bi-linkedin', label: 'LinkedIn' },
    { href: 'https://shopee.co.th/your', icon: 'bi-bag', label: 'Shopee' },
  ];

  const SKILLS = {
    'Frontend': ['Next.js', 'React', 'Bootstrap 5', 'Tailwind (utility)', 'Vercel'],
    'Design / Tools': ['Figma', 'Photoshop', 'Illustrator', 'Canva'],
    'Other': ['REST API', 'JWT/LocalStorage', 'Git/GitHub', 'SEO Basics'],
  };

  const QUICK = [
    { k: 'กำลังทำ', v: 'อินเทิร์น' },
    { k: 'สนใจพิเศษ', v: 'Game, Anime' },
    { k: 'กำลังเรียนรู้', v: 'แอนิเมชันใน React, การออกแบบแบบสอบถาม งานวิจัย' },
  ];

  const TIMELINE = [
    { year: '2025', text: 'ทำสื่อโปรโมชันออนไลน์' },
    { year: '2024', text: 'เริ่มทำโปรเจกต์ Next.js หลายหน้า + ดีไซน์ธีม Endfield' },
    { year: '2023', text: 'เริ่มจริงจังกับ Frontend และกราฟิก' },
  ];

  const CONTACT_ACTIONS = [
    { href: `mailto:${PROFILE.email}`, icon: 'bi-envelope', label: 'อีเมล' },
    { href: `tel:${PROFILE.phone.replace(/\D/g, '')}`, icon: 'bi-telephone', label: 'โทร' },
    { href: `https://line.me/ti/p/~${PROFILE.lineId}`, icon: 'bi-chat-dots', label: 'LINE' },
    { href: PROFILE.website, icon: 'bi-globe2', label: 'เว็บไซต์' },
  ];
  // =====================================

  return (
    <div className="container py-5">
      {/* HERO */}
      <section className="mb-4">
        <div className="card border-0 shadow-sm overflow-hidden hover-lift">
          <div className="row g-0 align-items-center">
            <div className="col-12 col-md-4 text-center p-4">
              <div className="avatar-wrap">
                <Image
                  src={PROFILE.avatar}
                  alt={PROFILE.nameTh}
                  width={160}
                  height={160}
                  className="rounded-circle object-fit-cover"
                  priority
                />
                <span className="status-dot" aria-hidden />
              </div>
              <div className="mt-3 small text-secondary">
                <i className="bi bi-geo-alt me-1" /> {PROFILE.location}
              </div>
            </div>
            <div className="col-12 col-md-8 p-4">
              <h1 className="h3 mb-1">{PROFILE.nameTh}</h1>
              <p className="text-primary fw-semibold mb-2">{PROFILE.role}</p>
              <p className="mb-3 text-muted">{PROFILE.tagline}</p>

              <div className="d-flex flex-wrap gap-2">
                <a className="btn btn-dark btn-sm" href={PROFILE.resumeUrl} target="_blank" rel="noopener">
                  <i className="bi bi-file-earmark-arrow-down me-2" /> ดาวน์โหลดเรซูเม่
                </a>
                <a className="btn btn-outline-primary btn-sm" href={PROFILE.website} target="_blank" rel="noopener">
                  <i className="bi bi-globe2 me-2" /> ดูพอร์ตโฟลิโอ
                </a>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {SOCIALS.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-light btn-sm border"
                    aria-label={s.label}
                  >
                    <i className={`bi ${s.icon} me-2`} /> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="row g-4">
        {/* Left: About + Skills + Timeline */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm hover-lift mb-4">
            <div className="card-body">
              <h2 className="h5 mb-3">เกี่ยวกับฉัน</h2>
              <p className="mb-3">
                ผมเป็นนักศึกษา IT ที่หลงใหลการทำเว็บและให้ความสำคัญกับ UX ที่เรียบง่ายแต่ “รู้สึกดี”
                ชอบผสมงานกราฟิกเข้ากับโค้ด
              </p>
              <ul className="list-unstyled mb-0">
                {QUICK.map((q, i) => (
                  <li key={i} className="d-flex align-items-start mb-2">
                    <i className="bi bi-check2-circle text-success me-2 mt-1" />
                    <div><span className="fw-semibold">{q.k}:</span> {q.v}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm hover-lift mb-4">
            <div className="card-body">
              <h2 className="h5 mb-3">ทักษะ</h2>
              {Object.entries(SKILLS).map(([group, items], idx) => (
                <div key={idx} className="mb-3">
                  <div className="text-secondary small mb-2">{group}</div>
                  <div className="d-flex flex-wrap gap-2">
                    {items.map((s, i) => (
                      <span key={i} className="badge rounded-pill bg-light text-dark border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="progress mt-3" style={{ height: 8 }} aria-label="Self-estimated skill confidence">
                <div className="progress-bar" style={{ width: '75%' }} />
              </div>
              <div className="small text-muted mt-1">ความมั่นใจภาพรวม ~75% (พัฒนาต่อเนื่อง)</div>
            </div>
          </div>

          <div className="card border-0 shadow-sm hover-lift">
            <div className="card-body">
              <h2 className="h5 mb-3">ไทม์ไลน์</h2>
              <ul className="timeline list-unstyled mb-0">
                {TIMELINE.map((t, i) => (
                  <li key={i} className="timeline-item">
                    <div className="dot" />
                    <div className="content">
                      <div className="fw-semibold">{t.year}</div>
                      <div className="text-muted">{t.text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Contact */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm hover-lift sticky-lg-top" style={{ top: 24 }}>
            <div className="card-body">
              <h2 className="h5 mb-3">ติดต่อ</h2>

              <div className="list-group mb-3">
                <a className="list-group-item list-group-item-action d-flex align-items-center" href={`mailto:${PROFILE.email}`}>
                  <i className="bi bi-envelope me-3" />
                  <div>
                    <div className="fw-semibold">อีเมล</div>
                    <div className="text-muted small">{PROFILE.email}</div>
                  </div>
                </a>
                <a className="list-group-item list-group-item-action d-flex align-items-center" href={`tel:${PROFILE.phone.replace(/\D/g, '')}`}>
                  <i className="bi bi-telephone me-3" />
                  <div>
                    <div className="fw-semibold">โทร</div>
                    <div className="text-muted small">{PROFILE.phone}</div>
                  </div>
                </a>
                <a className="list-group-item list-group-item-action d-flex align-items-center" href={`https://line.me/ti/p/~${PROFILE.lineId}`} target="_blank" rel="noopener">
                  <i className="bi bi-chat-dots me-3" />
                  <div>
                    <div className="fw-semibold">LINE</div>
                    <div className="text-muted small">@{PROFILE.lineId}</div>
                  </div>
                </a>
                <a className="list-group-item list-group-item-action d-flex align-items-center" href={PROFILE.website} target="_blank" rel="noopener">
                  <i className="bi bi-globe2 me-3" />
                  <div>
                    <div className="fw-semibold">เว็บไซต์</div>
                    <div className="text-muted small">{PROFILE.website.replace(/^https?:\/\//, '')}</div>
                  </div>
                </a>
                <a className="list-group-item list-group-item-action d-flex align-items-center" href={`https://maps.google.com/?q=${encodeURIComponent(PROFILE.location)}`} target="_blank" rel="noopener">
                  <i className="bi bi-geo-alt me-3" />
                  <div>
                    <div className="fw-semibold">ที่อยู่</div>
                    <div className="text-muted small">{PROFILE.location}</div>
                  </div>
                </a>
              </div>

              <div className="d-grid gap-2">
                {CONTACT_ACTIONS.map((c, i) => (
                  <a key={i} className="btn btn-outline-dark btn-sm" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
                    <i className={`bi ${c.icon} me-2`} />
                    {c.label}
                  </a>
                ))}
                <Link className="btn btn-primary btn-sm" href="/contact">
                  <i className="bi bi-send-check me-2" />
                  ส่งข้อความถึงฉัน
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD (optional SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: PROFILE.nameTh,
            jobTitle: PROFILE.role,
            url: PROFILE.website,
            email: PROFILE.email,
            telephone: PROFILE.phone,
            address: { '@type': 'PostalAddress', addressLocality: PROFILE.location },
            sameAs: SOCIALS.map(s => s.href),
          }),
        }}
      />

      <style jsx>{`
        .hover-lift {
          transition: transform .2s ease, box-shadow .2s ease;
          will-change: transform;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1.25rem rgba(0,0,0,.12);
        }
        .avatar-wrap {
          position: relative;
          display: inline-block;
        }
        .status-dot {
          position: absolute;
          right: 6px;
          bottom: 6px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94, .7);
          animation: ping 2s cubic-bezier(0,0,.2,1) infinite;
        }
        @keyframes ping {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,.6); }
          70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .timeline {
          position: relative;
          padding-left: 1rem;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(0,0,0,.075);
        }
        .timeline-item {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .timeline-item .dot {
          position: absolute;
          left: -1px;
          top: .3rem;
          width: 12px;
          height: 12px;
          background: #ffc107;
          border-radius: 999px;
          box-shadow: 0 0 0 .25rem rgba(255,193,7,.15);
        }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </div>
  );
}
