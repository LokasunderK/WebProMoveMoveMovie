import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Field } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { AuthController } from '../services/db';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, toast } = useAppContext();
  
  const [tab, setTab] = useState('login');
  const [err, setErr] = useState('');
  
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const u = await AuthController.login(email, pass);
    if (!u) return setErr('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    login(u);
    toast('เข้าสู่ระบบสำเร็จ');
    navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !pass) return setErr('กรุณากรอกข้อมูลให้ครบถ้วน');
    try {
      const u = await AuthController.register(email, pass, name);
      login(u);
      toast('สมัครสมาชิกสำเร็จ (ยินดีต้อนรับ +100 แต้ม)');
      navigate('/');
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <div className="animate-fadeUp" style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 420 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 className="font-serif" style={{ fontSize: 32, margin: '0 0 8px' }}>Move<span className="gold-text">³</span>Movie</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>ระบบแนะนำสถานที่ถ่ายทำตามรอยภาพยนตร์</p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 28 }}>
          {[['login', 'เข้าสู่ระบบ'], ['register', 'สมัครสมาชิก']].map(([v, l]) => (
            <button key={v} onClick={() => { setTab(v); setErr(''); }}
              className={`tab-item${tab === v ? ' active' : ''}`}
              style={{ flex: 1, textAlign: 'center', fontSize: 14, padding: '10px 0', marginBottom: -1, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {v === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />} 
              {l}
            </button>
          ))}
        </div>

        {err && (
          <div style={{ background: 'rgba(255,107,107,.1)', border: '1px solid rgba(255,107,107,.3)', color: '#FF6B6B', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} /> {err}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <Field label="อีเมล">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="inp" placeholder="admin@mmm.com" />
            </Field>
            <Field label="รหัสผ่าน">
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="inp" placeholder="••••••••" />
            </Field>
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px 0', borderRadius: 10, marginTop: 16 }}>
              <LogIn size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Field label="ชื่อ-นามสกุล">
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="inp" placeholder="สมชาย ใจดี" />
            </Field>
            <Field label="อีเมล">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="inp" placeholder="somchai@example.com" />
            </Field>
            <Field label="รหัสผ่าน">
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="inp" placeholder="••••••••" />
            </Field>
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px 0', borderRadius: 10, marginTop: 16 }}>
              <UserPlus size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              สร้างบัญชีใหม่
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
