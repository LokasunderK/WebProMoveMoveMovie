import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Film, Map, Gift, User, Settings, Megaphone, Clapperboard, LogOut, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PointController } from '../services/db';

const Navbar = () => {
  const { user, logout } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname;

  const pts = user ? PointController.get(user.id) : 0;
  
  const links = [
    { id: '/', l: 'หน้าหลัก', icon: Home },
    { id: '/movies', l: 'ภาพยนตร์', icon: Film },
    { id: '/map', l: 'แผนที่', icon: Map },
    ...(user ? [
      { id: '/rewards', l: 'ของรางวัล', icon: Gift },
      { id: '/profile', l: 'โปรไฟล์', icon: User }
    ] : []),
    ...(user?.role === 'admin' ? [{ id: '/admin', l: 'Admin', icon: Settings }] : []),
    ...(user?.role === 'partner' ? [{ id: '/partner', l: 'Partner', icon: Megaphone }] : []),
  ];

  const navTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="nav-blur" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 62 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <button onClick={() => navTo('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Clapperboard color="var(--gold)" size={24} />
            <span className="font-serif" style={{ fontSize: 18, color: 'var(--text)', fontWeight: 700 }}>
              Move<span className="gold-text">³</span>Movie
            </span>
          </button>
          
          <div className="nav-items" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {links.map(lk => {
              const active = page === lk.id || (lk.id !== '/' && page.startsWith(lk.id));
              return (
                <button key={lk.id} onClick={() => navTo(lk.id)}
                  className="tab-item"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 13, color: active ? 'var(--gold)' : 'var(--muted)', borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent' }}>
                  <lk.icon size={15} /> {lk.l}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(232,160,32,.1)', border: '1px solid rgba(232,160,32,.22)', borderRadius: 20, padding: '4px 13px', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                  <Star size={14} fill="var(--gold)" /> {pts}
                </div>
                <button onClick={logout} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 9, padding: '6px 14px', fontSize: 13 }}>
                  <LogOut size={14} /> ออก
                </button>
              </>
            ) : (
              <button onClick={() => navTo('/auth')} className="btn-gold" style={{ borderRadius: 10, padding: '8px 20px', fontSize: 13 }}>เข้าสู่ระบบ</button>
            )}
            
            <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} style={{ display: mobileOpen ? 'flex' : 'none' }}>
        {links.map(lk => {
          const active = page === lk.id || (lk.id !== '/' && page.startsWith(lk.id));
          return (
            <button key={lk.id} onClick={() => navTo(lk.id)} className={active ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <lk.icon size={18} /> {lk.l}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
