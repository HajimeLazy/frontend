'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function User() {
  const router = useRouter();

  // data state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  // search state
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  // debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  // auth + fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    let abort = false;

    async function getUsers() {
      try {
        setFetchError('');
        setLoading(true);
        const res = await fetch('https://backend-nextjs-virid.vercel.app/api/users', {
          // headers: { Authorization: `Bearer ${token}` }, // ใช้ถ้าหลังบ้านต้องการ
          cache: 'no-store',
        });
        if (!res.ok) {
          setFetchError('โหลดรายชื่อผู้ใช้ไม่สำเร็จ');
          setItems([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!abort) {
          setItems(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (e) {
        if (!abort) {
          setFetchError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
          setLoading(false);
        }
      }
    }

    getUsers();

    // ถ้าอยากให้ดึงซ้ำทุก X วินาที ให้คลายคอมเมนต์
    // const interval = setInterval(getUsers, 15000);
    // return () => { abort = true; clearInterval(interval); };

    return () => { abort = true; };
  }, [router]);

  // filter (client-side)
  const filtered = useMemo(() => {
    if (!debouncedQ) return items;
    const ql = debouncedQ.toLowerCase();
    return items.filter((u) => {
      const hay = [
        u.id,
        u.firstname,
        u.fullname,
        u.lastname,
        u.username,
        u.address,
        u.sex,
        u.birthday,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(ql);
    });
  }, [items, debouncedQ]);

  const handleDelete = async (id) => {
    if (!confirm('ลบผู้ใช้นี้หรือไม่?')) return;
    try {
      const res = await fetch(`https://backend-nextjs-virid.vercel.app/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        alert('ลบไม่สำเร็จ');
        return;
      }
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
      alert('ลบไม่สำเร็จ');
    }
  };

  const refresh = () => {
    // รีเฟรชแบบง่ายๆ ด้วยการรีโหลดเพจ (หรือจะย้ายเป็นฟังก์ชัน fetch แล้วเรียกซ้ำก็ได้)
    location.reload();
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 240 }}>
          <div className="text-center">
            <div className="spinner-border text-info mb-3" role="status" />
            <div>กำลังโหลดข้อมูล…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        {/* Header + Actions */}
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
          <div>
            <h3 className="mb-0 fw-bold">Users</h3>
            <small className="text-muted">รายการผู้ใช้งานทั้งหมด</small>
          </div>
          <div className="d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" />
              </span>
              <input
                className="form-control"
                placeholder="ค้นหา: ชื่อ, นามสกุล, Username, ที่อยู่, เพศ, วันเกิด…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button className="btn btn-outline-secondary" onClick={refresh}>
              <i className="bi bi-arrow-clockwise me-1" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {!!fetchError && (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{fetchError}</div>
          </div>
        )}

        {/* Card */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            {/* Info row */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-2">
              <div className="small text-muted">
                พบ {filtered.length} รายการ{debouncedQ ? ` (จากทั้งหมด ${items.length})` : ''}
              </div>
              {debouncedQ && (
                <div className="badge bg-light text-dark border">
                  คำค้น: “{debouncedQ}”
                </div>
              )}
            </div>

            {/* Table responsive wrapper */}
            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="text-center" style={{ width: 80 }}>#</th>
                    <th style={{ minWidth: 140 }}>Firstname</th>
                    <th style={{ minWidth: 160 }}>Fullname</th>
                    <th style={{ minWidth: 140 }}>Lastname</th>
                    <th style={{ minWidth: 140 }}>Username</th>
                    {/* <th>Password</th> */}
                    <th style={{ minWidth: 180 }}>Address</th>
                    <th style={{ width: 90 }}>Sex</th>
                    <th style={{ width: 140 }}>Birthday</th>
                    <th style={{ width: 80 }}>Edit</th>
                    <th style={{ width: 90 }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-5">
                        <div className="text-muted">ไม่พบผู้ใช้ที่ตรงกับคำค้น</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id}>
                        <td className="text-center">
                          <span className="badge bg-info-subtle text-dark border">{item.id}</span>
                        </td>
                        <td className="fw-semibold">{item.firstname}</td>
                        <td>{item.fullname}</td>
                        <td>{item.lastname}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {item.username}
                          </span>
                        </td>
                        {/* <td>{item.password}</td> */}
                        <td className="text-truncate" style={{ maxWidth: 220 }}>{item.address}</td>
                        <td>{item.sex}</td>
                        <td>{item.birthday}</td>
                        <td>
                          <Link href={`/admin/users/edit/${item.id}`} className="btn btn-sm btn-warning">
                            <i className="bi bi-pencil-square" /> Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            type="button"
                            onClick={() => handleDelete(item.id)}
                          >
                            <i className="bi bi-trash" /> Del
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer tiny note */}
            <div className="d-flex justify-content-end">
              <small className="text-muted">อัปเดตล่าสุด: {new Date().toLocaleString()}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal styles to smooth things out */}
      <style jsx>{`
        .badge.bg-info-subtle {
          background: #e6f7ff;
          border: 1px solid #b3e5ff !important;
        }
      `}</style>
    </>
  );
}
