"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const sync = () => setAuthed(!!localStorage.getItem("token"));
    sync();
    setMounted(true);
    const onStorage = () => sync();
    const onFocus = () => sync();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".ef-nav");
    nav?.classList.add("ef-ready");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 10) nav.classList.add("ef-shrink");
      else nav.classList.remove("ef-shrink");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

const handleSignOut = async () => {
  const res = await Swal.fire({
    title: "ออกจากระบบ?",
    text: "คุณต้องการออกจากระบบหรือไม่",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ออกจากระบบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#02D3FB",
    background: "#fff",
    color: "#111",
  });
  if (!res.isConfirmed) return;

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  setAuthed(false);

  // แจ้งเตือนสั้น ๆ แล้วไป login ทันที
  Swal.fire({
    title: "ออกจากระบบแล้ว",
    icon: "success",
    timer: 900,
    showConfirmButton: false,
    background: "#fff",
    color: "#111",
  });

  // เด้งไปหน้า /login เสมอ (กันหลงไป /admin/login แล้ว 404)
  router.replace("/login");

  // กันกรณี router ไม่ยอมเปลี่ยนหน้า (เช่น state เพี้ยนตอน dev)
  setTimeout(() => {
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }, 0);
};


  const items = [
    { name: "Home", href: "/" },
    { name: "About", href: "/service" },
    { name: "Service", href: "/contact" },
    { name: "Contact", href: "/about" },
    { name: "เข้าสู่ระบบ", href: "/login" }, // เรนเดอร์เสมอ แต่ค่อยซ่อนหลัง mount ถ้า authed
  ];

  // ✅ JS ล้วน ไม่มี type
  const isActiveLink = (href) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const hideLogin = mounted && authed; // ซ่อน login หลัง mount ถ้า authed

  return (
    <nav
      className="navbar navbar-expand-lg ef-nav ak-topglow"
      role="navigation"
      aria-label="Main"
    >
      <div className="container ef-inner">
        <Link className="navbar-brand ef-brand" href="/" aria-label="Home">
          <span>Blue Archive</span>
        </Link>

        <button
          className="navbar-toggler ef-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse ef-collapse ms-lg-auto"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ef-menu ms-lg-auto mb-2 mb-lg-0">
            {items.map((item) => {
              const active = isActiveLink(item.href);
              const isLogin = item.href === "/login";
              return (
                <li
                  className="nav-item"
                  key={item.name}
                  data-hide={isLogin && hideLogin ? "1" : "0"} // hydration-safe hide
                >
                  <Link
                    className={`nav-link ef-link ${active ? "active" : ""}`}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  >
                    {isLogin ? (
                      <>
                        <i className="bi bi-soundwave me-2" />
                        <span>{item.name}</span>
                      </>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {mounted && authed && (
            <button
              type="button"
              onClick={handleSignOut}
              className="btn btn-outline-ink ef-signout ms-lg-3"
            >
              <i className="bi bi-box-arrow-right" />
              <span className="ms-2 d-none d-xl-inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        /* ซ่อนรายการเมนูด้วย data-hide แบบไม่ทำให้ hydration mismatch */
        .nav-item[data-hide="1"] {
          display: none !important;
        }

        .ef-link {
          transition: color 0.25s ease, border-bottom 0.25s ease;
        }
        .ef-link.active {
          color: #02d3fb !important;
          border-bottom: 2px solid #02d3fb !important;
        }
        .ef-link:hover {
          color: #02d3fb !important;
        }
        .ak-topglow {
          box-shadow: 0 2px 10px rgba(2, 211, 251, 0.4);
        }
        .btn-outline-ink {
          border-color: #02d3fb;
          color: #02d3fb;
        }
        .btn-outline-ink:hover {
          background-color: #02d3fb;
          color: #fff;
        }
      `}</style>
    </nav>
  );
}
