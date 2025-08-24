'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Kanit } from 'next/font/google';

const kanit = Kanit({
  subsets: ['thai','latin'],
  weight: ['400','600','700','800'],
  variable: '--font-kanit',
});

export default function RegisterPage(){
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // ปรับปรุง form state ให้มี prefix, firstName และ lastName ที่ชัดเจนขึ้น
  const [form, setForm] = useState({
    prefix: '', // สำหรับคำนำหน้า (นาย, นางสาว, นาง)
    firstName: '', // สำหรับชื่อจริง
    lastName: '', // สำหรับนามสกุล
    username: '',
    address: '',
    sex: '',
    birthday: '',
    password: ''
  });
  const update = (k,v)=> setForm(s=>({ ...s, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      // แมปข้อมูลจาก form state ของเราไปยังโครงสร้างที่ backend คาดหวัง
      const payload = {
        firstname: form.prefix,    // Backend คาดหวัง firstname เป็นคำนำหน้า
        fullname: form.firstName,  // Backend คาดหวัง fullname เป็นชื่อจริง
        lastname: form.lastName,   // Backend คาดหวัง lastname เป็นนามสกุล
        username: form.username,
        address: form.address,
        sex: form.sex,
        birthday: form.birthday,
        password: form.password,
      };

      const res = await fetch('https://backend-nextjs-virid.vercel.app/api/users',{
        method:'POST',
        headers:{ 'Content-Type':'application/json', Accept:'application/json' },
        body: JSON.stringify(payload), // ส่ง payload ที่ถูกแมปแล้ว
      });
      const data = await res.json().catch(()=> ({}));
      if(res.ok){
        await Swal.fire({ icon:'success', title:'<h3>บันทึกข้อมูลเรียบร้อยแล้ว</h3>', timer:1600, showConfirmButton:false });
        router.push('/login');
      }else{
        Swal.fire({ icon:'error', title:'เกิดข้อผิดพลาด!', text:data?.message || '' });
      }
    }catch{
      Swal.fire({ icon:'error', title:'ข้อผิดพลาดเครือข่าย', text:'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    }finally{ setLoading(false); }
  };

  return (
    <div className={`auth-screen ak-yellow ${kanit.variable}`}>
      <div className="auth-bg" aria-hidden />
      <div className="scanline" aria-hidden />

      <section className="container">
        <header className="auth-head">
          <div className="auth-brand"><span>BLUE ARCHRIVE</span></div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">ลงทะเบียนคุณครูคนใหม่</p>
        </header>

        <form className="auth-card fade-in-up" onSubmit={handleSubmit}>
          <div className="auth-grid">
            {/* จัดเรียง คำนำหน้า, ชื่อจริง, นามสกุล ให้อยู่ในแถวเดียวกัน */}
            <div className="form-row-three-col auth-span-2"> {/* ใช้ auth-span-2 เพื่อให้กินพื้นที่ 2 คอลัมน์ (ถ้า auth-grid เป็น 2 คอลัมน์) */}
              <div className="form-field">
                <label htmlFor="prefix">คำนำหน้า</label>
                <select id="prefix" required value={form.prefix} onChange={e=>update('prefix', e.target.value)}>
                  <option value="">เลือก</option>
                  <option value="นาย">นาย</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="นาง">นาง</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="firstName">ชื่อจริง</label>
                <input id="firstName" type="text" required value={form.firstName} onChange={e=>update('firstName', e.target.value)} />
              </div>

              <div className="form-field">
                <label htmlFor="lastName">นามสกุล</label>
                <input id="lastName" type="text" required value={form.lastName} onChange={e=>update('lastName', e.target.value)} />
              </div>
            </div>
            {/* -------------------------------------------------------------------------- */}

            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" required value={form.username} onChange={e=>update('username', e.target.value)} />
            </div>

            <div className="form-field auth-span-2">
              <label htmlFor="address">Address</label>
              <textarea id="address" rows={2} required value={form.address} onChange={e=>update('address', e.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="sex">เพศ</label>
              <select id="sex" required value={form.sex} onChange={e=>update('sex', e.target.value)}>
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="birthday">วันเกิด</label>
              <input id="birthday" type="date" required value={form.birthday} onChange={e=>update('birthday', e.target.value)} />
            </div>

            <div className="form-field auth-span-2">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required value={form.password} onChange={e=>update('password', e.target.value)} />
            </div>
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn-yl" disabled={loading}>
              {loading ? 'กำลังสร้างบัญชี…' : 'Create Account'}
            </button>

            <a href="/login" className="btn-ghost">
              <i className="bi bi-box-arrow-in-right me-2" />
              Sign In
              <span className="trail" aria-hidden />
            </a>
          </div>
        </form>
      </section>

      {/* เพิ่ม CSS สำหรับการจัดเรียง 3 คอลัมน์ */}
      <style jsx>{`
        .form-row-three-col {
          display: grid;
          grid-template-columns: 0.8fr 1.5fr 1.5fr; /* คำนำหน้าจะเล็กกว่าสองอันที่เหลือ */
          gap: 12px;
          align-items: end; /* จัดให้ label อยู่ด้านล่างสุดของช่อง */
        }
        .form-row-three-col .form-field {
          margin-bottom: 0; /* ลบ margin-bottom เดิมออกเพื่อจัดเรียงใหม่ */
        }
        .form-row-three-col label {
          white-space: nowrap; /* ป้องกันไม่ให้ label ขึ้นบรรทัดใหม่ */
          margin-bottom: 4px; /* เพิ่มระยะห่างด้านล่าง label เล็กน้อย */
          display: block; /* ทำให้ label กินพื้นที่เต็มบรรทัด */
        }

        /* Responsive สำหรับมือถือ */
        @media (max-width: 640px) {
          .form-row-three-col {
            grid-template-columns: 1fr; /* บนมือถือให้เรียงเป็นแถวเดียว */
            gap: 0; /* ลบ gap ออก */
          }
          .form-row-three-col .form-field:not(:last-child) {
            margin-bottom: 16px; /* เพิ่มระยะห่างระหว่างแต่ละ field */
          }
        }
      `}</style>
    </div>
  );
}
