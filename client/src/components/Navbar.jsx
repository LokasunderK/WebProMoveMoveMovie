import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Film, Map, Gift, User, Settings, Megaphone,
  Clapperboard, LogOut, Star, Menu, X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PointController } from '../services/db';

const Navbar = () => {
  const { user, logout } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const page      = location.pathname;

  const pts = user ? PointController.get(user.id) : 0;

  const links = [
    { id: '/',        l: 'หน้าหลัก',  icon: Home },
    { id: '/movies',  l: 'ภาพยนตร์',  icon: Film },
    { id: '/map',     l: 'แผนที่',     icon: Map  },
    ...(user ? [
      { id: '/rewards', l: 'ของรางวัล', icon: Gift },
      { id: '/profile', l: 'โปรไฟล์',  icon: User },
    ] : []),
    ...(user?.role === 'admin'   ? [{ id: '/admin',   l: 'Admin',   icon: Settings  }] : []),
    ...(user?.role === 'partner' ? [{ id: '/partner', l: 'Partner', icon: Megaphone }] : []),
  ];

  const navTo = (path) => { navigate(path); setMobileOpen(false); };

  const isActive = (id) => page === id || (id !== '/' && page.startsWith(id));

  return (
    <>
      {/* ── Desktop / Mobile bar ── */}
      <nav className="nav-blur fixed top-0 inset-x-0 z-[1000]" style={{ height: 64 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <button
            onClick={() => navTo('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Clapperboard color="#D49B74" size={26} />
            <span className="font-serif" style={{ fontSize: 20, color: '#D49B74', fontWeight: 900 }}>
              Movie<span className="gold-text">²</span>Movies
            </span>
          </button>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {links.map(lk => (
              <button
                key={lk.id}
                onClick={() => navTo(lk.id)}
                className="tab-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: isActive(lk.id) ? '#E6A275' : '#BFC0C1',
                  borderBottomColor: isActive(lk.id) ? '#E6A275' : 'transparent',
                }}
              >
                <lk.icon size={15} /> {lk.l}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                {/* Points chip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(230, 162, 117, 0.12)', border: '1px solid rgba(230, 162, 117, 0.25)', borderRadius: 999, padding: '5px 14px', fontSize: 13, color: '#E6A275', fontWeight: 700 }}>
                  <Star size={13} fill="#E6A275" /> {pts}
                </div>
                <button
                  onClick={logout}
                  className="btn-ghost"
                  style={{ borderRadius: 10, padding: '7px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <LogOut size={14} /> ออก
                </button>
              </>
            ) : (
              <button
                onClick={() => navTo('/auth')}
                className="btn-gold"
                style={{ borderRadius: 10, padding: '9px 22px', fontSize: 14 }}
              >
                เข้าสู่ระบบ
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D49B74', display: 'none' }}
              className="show-mobile"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="nav-blur animate-fadeIn"
          style={{ position: 'fixed', top: 64, inset: '64px 0 0', zIndex: 999, display: 'flex', flexDirection: 'column', padding: '12px 0 24px', overflowY: 'auto' }}
        >
          {links.map(lk => (
            <button
              key={lk.id}
              onClick={() => navTo(lk.id)}
              style={{
                background: isActive(lk.id) ? 'rgba(230, 162, 117, 0.07)' : 'none',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 28px', fontSize: 16, fontWeight: 500,
                color: isActive(lk.id) ? '#E6A275' : '#BFC0C1',
                textAlign: 'left',
              }}
            >
              <lk.icon size={20} /> {lk.l}
            </button>
          ))}
          {user && (
            <div style={{ margin: '16px 28px 0', display: 'flex', alignItems: 'center', gap: 8, color: '#E6A275', fontSize: 14, fontWeight: 700 }}>
              <Star size={15} fill="#E6A275" /> แต้มสะสม: {pts} แต้ม
            </div>
          )}
        </div>
      )}

      {/* Responsive helper styles */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
