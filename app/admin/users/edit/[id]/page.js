'use client'
import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { useParams, useRouter } from 'next/navigation'

// ✅ ใช้ endpoint ตามที่ขอแบบชัดเจน
const USERS_API = 'https://backend-nextjs-virid.vercel.app/api/users'

// แปลง "14/02/2545" -> "2002-02-14"
function toInputDate(v) {
  if (!v) return ''
  if (typeof v === 'string' && v.includes('/')) {
    const [d, m, y] = v.split('/')
    let year = parseInt(y, 10)
    if (year > 2400) year -= 543
    return `${year.toString().padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return v.slice(0, 10)
}

export default function Page() {
  const router = useRouter()
  const { id } = useParams()

  const [firstname, setFirstname] = useState('')   // นาย/นาง/นางสาว
  const [fullname, setFullname]   = useState('')   // ชื่อ
  const [lastname, setLastname]   = useState('')   // นามสกุล
  const [username, setUsername]   = useState('')
  const [address, setAddress]     = useState('')
  const [sex, setSex]             = useState('')   // ชาย/หญิง/ไม่ระบุ
  const [birthday, setBirthday]   = useState('')   // YYYY-MM-DD
  const [password, setPassword]   = useState('')

  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPw, setShowPw]       = useState(false)
  const [initialUser, setInitialUser] = useState(null)

  // avatar initials
  const initials = useMemo(() => {
    const a = (fullname?.[0] || '').toUpperCase()
    const b = (lastname?.[0] || '').toUpperCase()
    return (a + b) || 'U'
  }, [fullname, lastname])

  // password strength (0-4)
  const pwdStrength = useMemo(() => {
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Zก-ฮ]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  }, [password])

  // dirty check
  const isDirty = useMemo(() => {
    if (!initialUser) return false
    return (
      initialUser.firstname !== firstname ||
      initialUser.fullname !== fullname ||
      initialUser.lastname !== lastname ||
      initialUser.username !== username ||
      (initialUser.address || '') !== address ||
      (initialUser.sex || '') !== sex ||
      toInputDate(initialUser.birthday || '') !== birthday ||
      initialUser.password !== password
    )
  }, [initialUser, firstname, fullname, lastname, username, address, sex, birthday, password])

  useEffect(() => {
    async function getUser() {
      try {
        // ✅ GET โดยใช้ /api/users/:id
        const res = await fetch(`${USERS_API}/${id}`)
        if (!res.ok) {
          console.error('Failed to fetch data', res.status, res.statusText)
          Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูลผู้ใช้', text: `ID: ${id}` })
          return
        }
        const data = await res.json()
        const user = Array.isArray(data) ? (data[0] || {}) : data
        setInitialUser(user)

        setFirstname(user.firstname || '')
        setFullname(user.fullname || '')
        setLastname(user.lastname || '')
        setUsername(user.username || '')
        setAddress(user.address || '')
        setSex(user.sex || '')
        setBirthday(toInputDate(user.birthday || ''))
        setPassword(user.password || '')
      } catch (err) {
        console.error('Error fetching data:', err)
        Swal.fire({ icon: 'error', title: 'ข้อผิดพลาดเครือข่าย', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' })
      } finally {
        setLoading(false)
      }
    }
    if (id) getUser()
  }, [id])

  const handleReset = () => {
    if (!initialUser) return
    setFirstname(initialUser.firstname || '')
    setFullname(initialUser.fullname || '')
    setLastname(initialUser.lastname || '')
    setUsername(initialUser.username || '')
    setAddress(initialUser.address || '')
    setSex(initialUser.sex || '')
    setBirthday(toInputDate(initialUser.birthday || ''))
    setPassword(initialUser.password || '')
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // ✅ PUT ไปที่ /api/users (ตามที่ให้มา) โดยส่ง id ใน body
      const res = await fetch(USERS_API, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id, firstname, fullname, lastname, username,
          address, sex, birthday, password
        })
      })

      const result = await res.json().catch(() => ({}))
      if (res.ok) {
        await Swal.fire({
          icon: 'success',
          title: '<h3>ปรับปรุงข้อมูลเรียบร้อยแล้ว</h3>',
          showConfirmButton: false,
          timer: 1600
        })
        router.push('/register')
      } else {
        console.error('Update failed:', result)
        Swal.fire({
          title: 'Error!',
          text: result?.message || 'เกิดข้อผิดพลาด!',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาดเครือข่าย',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // --- UI ---
  if (loading) {
    return (
      <div className="edit-shell">
        <div className="card">
          <div className="header">
            <div className="avatar skel" />
            <div className="title skel" style={{ width: 260 }} />
          </div>
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skel" key={i} style={{ height: 44 }} />
            ))}
          </div>
          <div className="skel" style={{ width: 180, height: 42 }} />
        </div>

        <style jsx>{styles}</style>
      </div>
    )
  }

  const strengthPct = Math.min(100, Math.max(0, (pwdStrength / 4) * 100))

  return (
    <div className="edit-shell">
      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="avatar">{initials}</div>
          <div className="head-text">
            <h1>แก้ไขข้อมูลสมัครสมาชิก <span className="accent">#{id}</span></h1>
            <p className="sub">ปรับปรุงโปรไฟล์ผู้ใช้และข้อมูลบัญชีของเซนเซย์</p>
          </div>
          <button className="btn ghost" onClick={() => router.push('/admin/users')} aria-label="ย้อนกลับ">
            ← ย้อนกลับ
          </button>
        </div>

        <hr />

        {/* Form */}
        <form onSubmit={handleUpdateSubmit}>
          <div className="grid">
            {/* คำนำหน้า */}
            <div className="field">
              <label>คำนำหน้า</label>
              <select value={firstname} onChange={(e) => setFirstname(e.target.value)} className="control" required>
                <option value="">-- เลือก --</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>

            {/* Username */}
            <div className="field">
              <label>Username</label>
              <div className="with-prefix">
                <span>@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="control"
                  required
                />
              </div>
            </div>

            {/* ชื่อ */}
            <div className="field">
              <label>ชื่อ (Fullname)</label>
              <input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="ชื่อจริง"
                className="control"
                required
              />
            </div>

            {/* นามสกุล */}
            <div className="field">
              <label>นามสกุล (Lastname)</label>
              <input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="นามสกุล"
                className="control"
                required
              />
            </div>

            {/* เพศ */}
            <div className="field full">
              <label>เพศ (Sex)</label>
              <div className="seg">
                {['ชาย', 'หญิง', 'ไม่ระบุ'].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setSex(v)}
                    className={`seg-item ${sex === v ? 'active' : ''}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* วันเกิด */}
            <div className="field">
              <label>วันเกิด (Birthday)</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="control"
              />
            </div>

            {/* Password */}
            <div className="field">
              <label>รหัสผ่าน (Password)</label>
              <div className="with-suffix">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="control"
                  required
                />
                <button type="button" className="btn small ghost" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? 'ซ่อน' : 'แสดง'}
                </button>
              </div>
              <div className="bar">
                <span className="bar-fill" style={{ width: `${strengthPct}%` }} data-level={pwdStrength} />
              </div>
            </div>

            {/* Address */}
            <div className="field full">
              <label>ที่อยู่ (Address)</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="control"
                placeholder="ที่อยู่ปัจจุบัน"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <small className={`note ${isDirty ? 'warn' : ''}`}>
              {isDirty ? 'มีการแก้ไขที่ยังไม่บันทึก' : 'ข้อมูลล่าสุดถูกบันทึกแล้ว'}
            </small>
            <div className="actions">
              <button type="button" className="btn ghost" disabled={!isDirty || submitting} onClick={handleReset}>
                รีเซ็ต
              </button>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting && <span className="spinner" />} บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{styles}</style>
    </div>
  )
}

/* ===== CSS-in-JSX ===== */
const styles = `
.edit-shell{
  --accent:#7dd3fc;       /* ฟ้าอ่อน */
  --accent2:#38bdf8;      /* ฟ้าอ่อนเข้ม */
  --stroke:#e7e7e7;
  --ink:#111;
  --muted:#6b7280;
  max-width: 880px; margin: 48px auto; padding: 0 16px;
}
.card{
  position:relative; overflow:hidden; border-radius:16px; border:1px solid rgba(7, 147, 255, 0.35);
  background: linear-gradient(135deg,#f0f9ff 0%, #e0f2fe 100%);   /* ฟ้าอ่อน background */
  box-shadow: 0 16px 32px rgba(0,0,0,.08);
}
.card::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.6;
  background:
    radial-gradient(900px 500px at 18% -14%, rgba(2, 132, 199, 0.12), transparent 55%),
    repeating-linear-gradient(0deg, rgba(0,0,0,.04) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(0,0,0,.04) 0 1px, transparent 1px 22px);
}
.header{ position:relative; display:flex; gap:14px; align-items:center; padding:20px 20px 12px; z-index:1; }
.avatar{
  width:56px; height:56px; display:grid; place-items:center; border-radius:16px;
  border:1px solid rgba(125, 211, 252, 0.5); background:#fff; color:#333; font-weight:800; font-size:1.1rem;
  box-shadow:0 8px 16px rgba(0,0,0,.06);
}
.head-text{ flex:1 }
h1{ font-size:20px; margin:0; color:var(--ink) }
.sub{ margin:4px 0 0; color:var(--muted); font-size:13px }
.accent{ color:var(--accent2) }
.btn{
  border:1px solid var(--stroke); background:#fff; color:#333; border-radius:12px; padding:10px 14px;
  font-size:14px; cursor:pointer; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, opacity .16s;
}
.btn:hover{ transform:translateY(-1px); box-shadow:0 8px 16px rgba(0,0,0,.08) }
.btn:disabled{ opacity:.55; cursor:not-allowed }
.btn.ghost{ background: rgba(75, 188, 196, 0.86) }
.btn.small{ padding:8px 10px; border-radius:10px; font-size:12px }
.btn.primary{
  border-color:transparent; color:#222;
  background: linear-gradient(90deg,var(--accent),var(--accent2));  /* ใช้สีฟ้า */
  box-shadow: 0 10px 20px rgba(125, 211, 252, 0.3);
}
hr{ border:none; border-top:1px solid rgba(0,0,0,.06); margin:0 }

form{ position:relative; z-index:1; padding:18px 20px 8px }
.grid{
  display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:14px;
}
.field{ display:flex; flex-direction:column; gap:8px }
.field.full{ grid-column: 1 / -1 }
label{ font-size:13px; color:#334155; font-weight:600 }
.control{
  width:100%; border:1px solid #d9d9d9; border-radius:12px; padding:11px 12px; font-size:14px; background:#fff;
  outline:none; transition:border-color .16s ease, box-shadow .16s ease;
}
.control:focus{ border-color:var(--accent); box-shadow: 0 0 0 .2rem rgba(125,211,252,.35) }

.with-prefix{ position:relative }
.with-prefix > span{
  position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#9aa0a6; pointer-events:none
}
.with-prefix .control{ padding-left:26px }

.with-suffix{ position:relative; display:flex; gap:8px; align-items:center }
.with-suffix .control{ flex:1 }

.seg{
  display:inline-flex; border:1px solid #d9d9d9; border-radius:12px; overflow:hidden; background:#fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.seg-item{
  padding:8px 14px; font-size:14px; background:transparent; border:none; cursor:pointer; transition: background .12s ease, color .12s ease;
}
.seg-item:not(.active):hover{ background:#e0f2fe }
.seg-item.active{ background: var(--accent2); color:#fff; font-weight:600 }

.bar{ margin-top:8px; width:100%; height:6px; background:#eaeaea; border-radius:999px; overflow:hidden }
.bar-fill{ display:block; height:100% }
.bar-fill[data-level="0"]{ width:0% }
.bar-fill[data-level="1"]{ background:#93c5fd }
.bar-fill[data-level="2"]{ background:#60a5fa }
.bar-fill[data-level="3"]{ background:#38bdf8 }
.bar-fill[data-level="4"]{ background:#0ea5e9 }

.footer{
  margin-top:16px; padding:14px 0 8px; border-top:1px solid rgba(0,0,0,.06);
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.note{ color:#6b7280; font-size:12px }
.note.warn{ color:#0284c7 }

.spinner{
  display:inline-block; width:14px; height:14px; margin-right:6px; border:2px solid rgba(0,0,0,.25);
  border-right-color: transparent; border-radius:999px; animation: spin .8s linear infinite; vertical-align:-2px;
}
@keyframes spin{ to{ transform: rotate(360deg) } }

/* Skeleton */
.skel{
  background: linear-gradient(90deg,#eef6fb,#f8fdff,#eef6fb);
  background-size: 200% 100%;
  animation: pulse 1.1s ease-in-out infinite;
  border-radius:12px;
}
@keyframes pulse{ 0%{background-position: 0% 0} 100%{background-position: -200% 0} }

@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
  .btn.ghost{ order:-1 }
}
`

