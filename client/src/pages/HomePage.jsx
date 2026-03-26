import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, ChevronRight, PlayCircle } from 'lucide-react';
import { Particles } from '../components/UI';
import { MovieController, LocationController } from '../services/db';

const HomePage = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const popMovies = MovieController.list().slice(0, 4);
  const popLocations = LocationController.list().filter(l => !l.hidden).slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/movies?q=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      <div className="hero-bg" style={{ minHeight: '93vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '76px 24px 60px' }}>
        <Particles count={25} />
        <div className="animate-fadeUp d1" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge" style={{ marginBottom: 20 }}>
            <PlayCircle size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} /> 
            ระบบแนะนำสถานที่ถ่ายทำตามรอยภาพยนตร์
          </span>
        </div>
        <h1 className="animate-fadeUp d2 hero-title font-serif"
          style={{ fontSize: 'clamp(38px,7vw,76px)', lineHeight: 1.1, margin: '0 0 18px', maxWidth: 820, position: 'relative', zIndex: 1 }}>
          ตามรอย<span className="gold-text">ภาพยนตร์</span><br />ในสถานที่จริง
        </h1>
        <p className="animate-fadeUp d3" style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 500, margin: '0 0 38px', lineHeight: 1.75, position: 'relative', zIndex: 1 }}>
          ค้นพบสถานที่ถ่ายทำหนังและซีรีส์ไทยที่คุณชื่นชอบ<br />พร้อมรีวิวจากผู้ที่ไปตามรอยจริง
        </p>

        <form onSubmit={handleSearch} className="animate-fadeUp d4" style={{ position: 'relative', width: '100%', maxWidth: 500, zIndex: 1 }}>
          <input
            type="text"
            placeholder="ค้นหาภาพยนตร์, ฉาก, สถานที่..."
            value={q} onChange={e => setQ(e.target.value)}
            style={{ width: '100%', padding: '16px 24px', paddingLeft: 54, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 30, color: 'var(--text)', fontSize: 15, backdropFilter: 'blur(10px)', outline: 'none', transition: 'border-color .2s, box-shadow .2s' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(232,160,32,.5)'; e.target.style.boxShadow = '0 0 0 4px rgba(232,160,32,.12)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.1)'; e.target.style.boxShadow = 'none'; }}
          />
          <Search size={22} color="var(--muted)" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
          <button type="submit" className="btn-gold" style={{ position: 'absolute', right: 6, top: 6, bottom: 6, padding: '0 24px', borderRadius: 24, fontSize: 14 }}>
            ค้นหา
          </button>
        </form>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 className="font-serif" style={{ fontSize: 26, margin: 0 }}>ภาพยนตร์<span className="gold-text">ยอดฮิต</span></h2>
          <button onClick={() => navigate('/movies')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 20, padding: '6px 16px', fontSize: 13 }}>
            ดูทั้งหมด <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="movie-grid">
          {popMovies.map(m => (
            <div key={m.id} className="card-hover" onClick={() => navigate(`/movies/${m.id}`)}
              style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 280, position: 'relative' }}>
                <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 15px 15px', background: 'linear-gradient(transparent, #0D0D1A)' }}>
                  <span style={{ background: 'rgba(232,160,32,.9)', color: '#07070F', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>★ 4.8</span>
                </div>
              </div>
              <div style={{ padding: '14px 15px' }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.releaseYear} • {m.genre || 'ภาพยนตร์'}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 80 }}>
          <h2 className="font-serif" style={{ fontSize: 26, margin: '0 0 28px' }}>สถานที่<span className="gold-text">ยอดนิยม</span></h2>
          <div className="scene-grid">
            {popLocations.map(l => (
              <div key={l.id} className="card-hover" onClick={() => navigate(`/location/${l.id}`)}
                style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(232,160,32,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                      <MapPin size={24} />
                    </div>
                    <div style={{ color: 'var(--muted)' }}><Heart size={20} /></div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{l.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>{l.province}</div>
                  <p style={{ fontSize: 13, color: '#A8A5B4', lineHeight: 1.6, margin: 0 }}>
                    {l.description ? (l.description.length > 80 ? l.description.substring(0, 80) + '...' : l.description) : 'ไม่มีรายละเอียด'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
