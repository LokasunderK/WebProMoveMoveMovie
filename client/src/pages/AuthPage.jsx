import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle, Clapperboard } from 'lucide-react';
import { Field } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { AuthController } from '../services/db';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, toast } = useAppContext();

  const [tab,   setTab]   = useState('login');
  const [err,   setErr]   = useState('');
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [name,  setName]  = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const u = await AuthController.login(email, pass);
    if (!u) return setErr('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    login(u); toast('เข้าสู่ระบบสำเร็จ'); navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !pass) return setErr('กรุณากรอกข้อมูลให้ครบถ้วน');
    try {
      const u = await AuthController.register(email, pass, name);
      login(u); toast('สมัครสมาชิกสำเร็จ (ยินดีต้อนรับ +100 แต้ม)'); navigate('/');
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 60px',
      background: 'radial-gradient(ellipse 80% 70% at 50% 30%, rgba(230,162,117,0.08) 0%, transparent 65%), #FEF5E7',
    }}>
      <div
        className="animate-fadeUp"
        style={{
          background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)',
          borderRadius: 24, padding: '48px 40px',
          width: '100%', maxWidth: 440,
          boxShadow: '0 24px 64px rgba(212, 155, 116, 0.12)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
            <Clapperboard size={28} color="#D49B74" />
            <h1 className="font-serif gold-text" style={{ fontSize: 28, margin: 0, fontWeight: 900 }}>
              Movie²Movies
            </h1>
          </div>
          <p style={{ color: '#BFC0C1', fontSize: 16, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            ระบบแนะนำสถานที่ถ่ายทำตามรอยภาพยนตร์
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(212, 155, 116, 0.1)', marginBottom: 32 }}>
          {[['login', <LogIn size={15} />, 'เข้าสู่ระบบ'], ['register', <UserPlus size={15} />, 'สมัครสมาชิก']].map(([v, icon, l]) => (
            <button
              key={v}
              onClick={() => { setTab(v); setErr(''); }}
              className="tab-item"
              style={{
                flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: 7, padding: '10px 0', marginBottom: -1, fontSize: 16,
                color: tab === v ? '#D49B74' : '#BFC0C1',
                borderBottomColor: tab === v ? '#D49B74' : 'transparent',
              }}
            >
              {icon} {l}
            </button>
          ))}
        </div>

        {/* Error */}
        {err && (
          <div style={{
            background: 'rgba(255,107,107,.1)', border: '1px solid rgba(255,107,107,.3)',
            color: '#FF6B6B', padding: '13px 16px', borderRadius: 12,
            fontSize: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <AlertCircle size={17} /> {err}
          </div>
        )}

        {/* Login form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <Field label="อีเมล">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="inp" placeholder="admin@mmm.com" />
            </Field>
            <Field label="รหัสผ่าน">
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="inp" placeholder="••••••••" />
            </Field>
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px 0', borderRadius: 12, marginTop: 8, fontSize: 15, gap: 8 }}>
              <LogIn size={17} /> เข้าสู่ระบบ
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
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px 0', borderRadius: 12, marginTop: 8, fontSize: 15, gap: 8 }}>
              <UserPlus size={17} /> สร้างบัญชีใหม่
            </button>
          </form>
        )}

        {/* Hint */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#7A7990', lineHeight: 1.6 }}>
          {tab === 'login' ? (
            <span>ยังไม่มีบัญชี? <button onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: '#E8A020', cursor: 'pointer', fontWeight: 600 }}>สมัครสมาชิก</button></span>
          ) : (
            <span>มีบัญชีแล้ว? <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: '#E8A020', cursor: 'pointer', fontWeight: 600 }}>เข้าสู่ระบบ</button></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
