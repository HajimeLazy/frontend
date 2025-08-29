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

// แปลงจาก input YYYY-MM-DD -> รูปแบบเดิมของ BE (ถ้าเดิมเป็น DD/MM/YYYY หรือปี พ.ศ.)
function toApiDate(inputYYYYMMDD, originalFromApi) {
  if (!inputYYYYMMDD) return ''
  const isSlash = typeof originalFromApi === 'string' && originalFromApi.includes('/')
  if (!isSlash) return inputYYYYMMDD

  const [y, m, d] = inputYYYYMMDD.split('-') // YYYY-MM-DD
  const origYear = parseInt(String(originalFromApi).split('/')[2], 10)
  let year = parseInt(y, 10)

  // ถ้าเดิมเป็น พ.ศ. (>2400) ให้ +543 กลับก่อนส่ง
  if (!Number.isNaN(origYear) && origYear > 2400 && year < 2400) {
    year += 543
  }
  return `${d}/${m}/${String(year).padStart(4, '0')}` // DD/MM/YYYY หรือ DD/MM/พ.ศ.
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
    if (!id) return

    setSubmitting(true)

    // ✅ แปลงวันเกิดกลับเป็นรูปแบบเดิมของ BE (ถ้าเดิมเป็นแบบมี '/')
    const birthdayForApi = toApiDate(birthday, initialUser?.birthday)

    // ✅ ส่งทุกฟิลด์ที่ต้องการเก็บ ไม่อย่างนั้น BE อาจเคลียร์ค่าเดิมทิ้ง
    const payload = {
      id: Number(id),   // เผื่อ BE ต้องการ number
      firstname,
      fullname,
      lastname,
      username,
      password,
      address,
      sex,
      birthday: birthdayForApi,
    }

    // helper: ยิง request แบบเลือกใส่ Content-Type ได้ (บาง BE ไม่ชอบ preflight)
    const tryRequest = async (withJSONHeader) => {
      const headers = withJSONHeader
        ? { Accept: 'application/json', 'Content-Type': 'application/json' }
        : { Accept: 'application/json' }

      const res = await fetch(USERS_API, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
        cache: 'no-store',
        mode: 'cors',
      })

      const ct = res.headers.get('content-type') || ''
      const data = ct.includes('application/json')
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => '')

      return { res, data }
    }

    try {
      // ยิงแบบไม่ใส่ Content-Type ก่อน (หลบ preflight/CORS)
      let { res, data } = await tryRequest(false)

      // ถ้าไม่ผ่าน ลองซ้ำอีกรอบด้วย Content-Type: application/json
      if (!res.ok) {
        const retry = await tryRequest(true)
        if (retry.res.ok) {
          res = retry.res
          data = retry.data
        } else {
          console.error('Update failed:', retry.res.status, retry.res.statusText, retry.data)
          await Swal.fire({
            title: 'อัปเดตไม่สำเร็จ',
            text: typeof retry.data === 'string'
              ? retry.data
              : (retry.data?.message || `HTTP ${retry.res.status}`),
            icon: 'error',
          })
          setSubmitting(false)
          return
        }
      }

      await Swal.fire({
        icon: 'success',
        title: '<h3>ปรับปรุงข้อมูลเรียบร้อยแล้ว</h3>',
        showConfirmButton: false,
        timer: 1600,
      })

      // กลับหน้ารายการผู้ใช้ให้สอดคล้องกับปุ่ม "ย้อนกลับ"
      router.push('/admin/users')
    } catch (error) {
      console.error('Update error:', error)
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
  --accent2:#0ea5e9;      /* ฟ้าเข้มขึ้นนิด */
  --stroke:#e7e7e7;
  --ink:#0f172a;
  --muted:#64748b;
  max-width: 880px; margin: 48px auto; padding: 0 16px;
}

/* การ์ดโทนขาวเป็นหลัก แซมฟ้าอ่อน */
.card{
  position:relative; overflow:hidden; border-radius:16px;
  border:1px solid rgba(14,165,233,.18);
  background: linear-gradient(180deg,#ffffff 0%, #f8fbff 100%);
  box-shadow: 0 16px 32px rgba(15,23,42,.06);
}
.card::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.6;
  background:
    radial-gradient(900px 500px at 18% -14%, rgba(14,165,233,.08), transparent 55%),
    repeating-linear-gradient(0deg, rgba(2,6,23,.03) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(2,6,23,.03) 0 1px, transparent 1px 22px);
}

/* Header */
.header{ position:relative; display:flex; gap:14px; align-items:center; padding:20px 20px 12px; z-index:1; }
.avatar{
  width:56px; height:56px; display:grid; place-items:center; border-radius:16px;
  border:1px solid rgba(125,211,252,.55); background:#fff; color:#1f2937; font-weight:800; font-size:1.1rem;
  box-shadow:0 8px 16px rgba(0,0,0,.06);
}
.head-text{ flex:1 }
h1{ font-size:20px; margin:0; color:var(--ink) }
.sub{ margin:4px 0 0; color:var(--muted); font-size:13px }
.accent{ color:var(--accent2) }

/* Buttons */
.btn{
  border:1px solid var(--stroke); background:#fff; color:#1f2937; border-radius:12px; padding:10px 14px;
  font-size:14px; cursor:pointer; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, opacity .16s;
}
.btn:hover{ transform:translateY(-1px); box-shadow:0 8px 16px rgba(0,0,0,.08) }
.btn:disabled{ opacity:.55; cursor:not-allowed }
.btn.ghost{ background: rgba(255,255,255,.86) } /* ขาวโปร่ง */
.btn.small{ padding:8px 10px; border-radius:10px; font-size:12px }
.btn.primary{
  border-color:transparent; color:#0f172a;
  background: linear-gradient(90deg,#ffffff,#eaf7ff 35%, var(--accent) 100%);
  box-shadow: 0 10px 20px rgba(125,211,252,.26);
}

/* Divider */
hr{ border:none; border-top:1px solid rgba(2,6,23,.06); margin:0 }

/* Form grid */
form{ position:relative; z-index:1; padding:18px 20px 8px }
.grid{
  display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:14px;
}
.field{ display:flex; flex-direction:column; gap:8px }
.field.full{ grid-column: 1 / -1 }
label{ font-size:13px; color:#334155; font-weight:600 }

/* Controls */
.control{
  width:100%; border:1px solid #e5e7eb; border-radius:12px; padding:11px 12px; font-size:14px; background:#fff;
  outline:none; transition:border-color .16s ease, box-shadow .16s ease;
}
.control:focus{ border-color:var(--accent2); box-shadow: 0 0 0 .2rem rgba(14,165,233,.18) }

/* Prefix/Suffix */
.with-prefix{ position:relative }
.with-prefix > span{
  position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none
}
.with-prefix .control{ padding-left:26px }
.with-suffix{ position:relative; display:flex; gap:8px; align-items:center }
.with-suffix .control{ flex:1 }

/* Segmented */
.seg{
  display:inline-flex; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.seg-item{
  padding:8px 14px; font-size:14px; background:transparent; border:none; cursor:pointer; transition: background .12s ease, color .12s ease;
}
.seg-item:not(.active):hover{ background:#f0f9ff }  /* ขาวฟ้า */
.seg-item.active{ background: var(--accent2); color:#fff; font-weight:600 }

/* Password meter */
.bar{ margin-top:8px; width:100%; height:6px; background:#eef2f7; border-radius:999px; overflow:hidden }
.bar-fill{ display:block; height:100% }
.bar-fill[data-level="0"]{ width:0% }
.bar-fill[data-level="1"]{ background:#cfe7ff }
.bar-fill[data-level="2"]{ background:#93c5fd }
.bar-fill[data-level="3"]{ background:#60a5fa }
.bar-fill[data-level="4"]{ background:#0ea5e9 }

/* Footer */
.footer{
  margin-top:16px; padding:14px 0 8px; border-top:1px solid rgba(2,6,23,.06);
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.note{ color:#6b7280; font-size:12px }
.note.warn{ color:#0ea5e9 }

/* Spinner */
.spinner{
  display:inline-block; width:14px; height:14px; margin-right:6px; border:2px solid rgba(15,23,42,.25);
  border-right-color: transparent; border-radius:999px; animation: spin .8s linear infinite; vertical-align:-2px;
}
@keyframes spin{ to{ transform: rotate(360deg) } }

/* Skeleton */
.skel{
  background: linear-gradient(90deg,#f7fbff,#ffffff,#f7fbff);
  background-size: 200% 100%;
  animation: pulse 1.1s ease-in-out infinite;
  border-radius:12px;
}
@keyframes pulse{ 0%{background-position: 0% 0} 100%{background-position: -200% 0} }

/* Responsive */
@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
  .btn.ghost{ order:-1 }
}
`
