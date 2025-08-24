"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";

export default function EndfieldCarousel() {
  const slides = useMemo(
    () => [
      {
        id: 1,
        title: "1st Anniversary Animation PV",
        kind: "video",
        video: "https://www.youtube.com/embed/bmdJQvpkQZY?si=Bw-jbfryomW9-SWl",
        thumb: "/images/sliders/1st.jpg",
      },
      {
        id: 2,
        title: "Blue Archive 2nd PV",
        kind: "video",
        video: "https://www.youtube.com/embed/cE1ePjq5ZSs?si=tfm2tFYc_ng-eCCL",
        thumb: "/images/sliders/2ed.jpg",
      },
      {
        id: 3,
        title: "Blue Archive 4nd PV",
        kind: "video",
        video: "https://www.youtube.com/embed/yZa5abuIKT4?si=rYk7x5uAtQuCEEiu",
        thumb: "/images/sliders/4th.jpg",
      },
      {
        id: 4,
        title:
          "Blue Archive 5nd PV",
        kind: "video",
        video: "https://www.youtube.com/embed/wZd18g3UshI?si=RqdSnNbWh8hTrbdR",
        thumb: "/images/sliders/5th.jpg",
      },
      {
        id: 5,
        title:
          "Blue Archive 6nd PV",
        kind: "video",
        video: "https://www.youtube.com/embed/JwWVgGE5b0Q?si=swNxveatsRrRYl20",
        thumb: "/images/sliders/6th.jpg",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const wrapRef = useRef(null);

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  // เลื่อนแถบ thumbnail ให้รูป active ชิดกลาง
  useEffect(() => {
    const w = wrapRef.current;
    if (!w) return;
    const active = w.querySelector(`[data-k="${idx}"]`);
    if (active) {
      const r = active.getBoundingClientRect();
      const rw = w.getBoundingClientRect();
      const delta = r.left - rw.left - (rw.width / 2 - r.width / 2);
      w.scrollBy({ left: delta, behavior: "smooth" });
    }
  }, [idx]);

  const s = slides[idx];

  return (
    <div className="ef-carousel">
      <div className="stage">
        {/* ปุ่มนำทาง */}
        <button className="nav prev" aria-label="Previous" onClick={prev}>
          <i className="bi bi-chevron-left" />
        </button>
        <button className="nav next" aria-label="Next" onClick={next}>
          <i className="bi bi-chevron-right" />
        </button>

        {/* เนื้อหาหลัก */}
        <div className="frame">
          {s.kind === "video" ? (
            <iframe
              src={`${s.video}`}
              title={s.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
              priority
            />
          )}
        </div>

        {/* ชื่อเรื่องซ้ายล่างแบบไซต์จริง */}
        <div className="caption">
          <i className="bi bi-play-fill me-2" />
          <span className="title">{s.title}</span>
        </div>
      </div>

      {/* แถบ thumbnail */}
      <div className="thumbs" ref={wrapRef}>
        {slides.map((t, i) => (
          <button
            key={t.id}
            data-k={i}
            className={`thumb ${i === idx ? "active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to ${t.title}`}
            title={t.title}
          >
            <Image src={t.thumb} alt="" width={240} height={120} />
          </button>
        ))}
      </div>

      <style jsx>{`
        .ef-carousel {
          --radius: 14px;
          color: #111;
        }
        .stage {
          position: relative;
          border: 1px solid var(--stroke, #e3e6ea);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
          background: #fff;
        }
        .frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #fff;
        }
        .frame :global(iframe) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .caption {
          position: absolute;
          left: 18px;
          bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #111;
          font-weight: 800;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.9);
          padding: 6px 10px;
          border-radius: 999px;
          background: linear-gradient(180deg, #ffffff, #f6f7f8);
          border: 1px solid var(--stroke, #e3e6ea);
        }

        .nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid var(--stroke, #e3e6ea);
          background: #fff;
          color: #111;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
        .nav:hover {
          filter: brightness(1.03);
        }
        .nav.prev {
          left: 12px;
        }
        .nav.next {
          right: 12px;
        }

        .thumbs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 14px 6px 4px;
          margin-top: 10px;
          scroll-snap-type: x mandatory;
        }
        .thumb {
          border: 1px solid var(--stroke, #e3e6ea);
          border-radius: 12px;
          overflow: hidden;
          flex: 0 0 auto;
          background: #fff;
          position: relative;
          scroll-snap-align: center;
        }
        .thumb.active {
          outline: 2px solid var(--yl, #02D3FB);
          box-shadow: 0 0 14px rgba(172, 235, 252, 0.35);
        }
        .thumb :global(img) {
          display: block;
        }
      `}</style>
    </div>
  );
}
