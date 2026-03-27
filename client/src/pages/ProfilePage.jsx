import React from 'react';
import { User, Gift, Clock, Star, Mail, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PointController } from '../services/db';

const ProfilePage = () => {
  const { user } = useAppContext();
  const pts = PointController.get(user?.id);

  if (!user) return <Navigate to="/auth" replace />;

  const statCards = [
    { label: 'แต้มสะสม', value: pts, unit: 'pts', icon: <Star size={24} fill="#E6A275" />, color: '#E6A275', bg: '#FFFFFF', border: 'rgba(230,162,117,0.2)' },
    { label: 'รีวิวที่เขียน', value: 0, unit: 'รีวิว', icon: <Gift size={24} color="#D49B74" />, color: '#D49B74', bg: '#FFFFFF', border: 'rgba(212,155,116,0.2)' },
    { label: 'สิทธิ์ที่แลก', value: 0, unit: 'ครั้ง', icon: <Clock size={24} color="#D49B74" />, color: '#D49B74', bg: '#FFFFFF', border: 'rgba(212,155,116,0.2)' },
  ];

  const roleLabel = { admin: 'ผู้ดูแลระบบ', partner: 'พาร์ทเนอร์', member: 'สมาชิก' };
  const roleBadge = { admin: 'badge-green', partner: 'badge', member: 'badge-gray' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '120px 24px 100px' }}>
      <div className="animate-fadeUp">

        {/* ── Profile banner ── */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid rgba(212, 155, 116, 0.15)',
          borderRadius: 24, overflow: 'hidden', marginBottom: 32,
          boxShadow: '0 12px 40px rgba(212, 155, 116, 0.08)'
        }}>
          {/* Cover gradient */}
          <div style={{ height: 120, background: 'linear-gradient(135deg, rgba(232,160,32,.15), rgba(120,80,220,.08), transparent)' }} />

          {/* Avatar + info */}
          <div style={{ padding: '0 36px 36px', display: 'flex', gap: 28, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: -48 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #E6A275, #D49B74)',
              border: '4px solid #FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, fontWeight: 900, color: '#FFFFFF',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>

            <div style={{ flex: 1, minWidth: 200, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 className="font-serif" style={{ fontSize: 32, margin: 0, color: '#4A4A4A', fontWeight: 800 }}>{user.name}</h1>
                <span className={`badge ${roleBadge[user.role] || 'badge-gray'}`} style={{ fontSize: 13 }}>
                  <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {roleLabel[user.role] || user.role}
                </span>
              </div>
              <div style={{ color: '#BFC0C1', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={16} /> {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {statCards.map(s => (
            <div
              key={s.label}
              style={{
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 16, padding: '24px 28px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{ color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
                  {s.value}
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#7A7990', marginLeft: 6, fontFamily: "'DM Sans', sans-serif" }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: '#7A7990', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Activity ── */}
        <div>
          <h2 className="font-serif" style={{ fontSize: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#D49B74' }}>
            <Clock size={28} color="#D49B74" /> กิจกรรมล่าสุด
          </h2>
          <div style={{
            background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)',
            borderRadius: 18, padding: '52px 36px', textAlign: 'center',
          }}>
            <Gift size={52} color="rgba(212, 155, 116, 0.2)" style={{ margin: '0 auto 18px' }} />
            <div style={{ fontSize: 20, color: '#4A4A4A', marginBottom: 8, fontWeight: 700 }}>ยังไม่มีประวัติกิจกรรม</div>
            <div style={{ fontSize: 16, color: '#BFC0C1' }}>
              สะสมแต้มจากการแชร์ประสบการณ์ แล้วนำมาแลกรางวัลได้เลย!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
