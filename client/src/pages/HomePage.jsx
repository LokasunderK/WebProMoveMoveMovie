import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, ChevronRight, PlayCircle } from 'lucide-react';
import { Particles } from '../components/UI';
import { MovieController, LocationController } from '../services/db';

const HomePage = () => {
  const navigate     = useNavigate();
  const [q, setQ]    = useState('');
  const popMovies    = MovieController.list().slice(0, 4);
  const popLocations = LocationController.list().filter(l => !l.hidden).slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/movies?q=${encodeURIComponent(q)}`);
  };

  return (
    <div>
      {/* ══ HERO ══ */}
      <section
        className="hero-bg"
        style={{
          minHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '90px 24px 64px',
        }}
      >
        <Particles count={28} />

        {/* Badge */}
        <div className="animate-fadeUp d1" style={{ position: 'relative', zIndex: 2, marginBottom: 24 }}>
          <span className="badge" style={{ fontSize: 16, padding: '8px 20px' }}>
            <PlayCircle size={15} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            ระบบแนะนำสถานที่ถ่ายทำตามรอยภาพยนตร์
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fadeUp d2 hero-title font-serif"
          style={{
            position: 'relative', zIndex: 2,
            fontSize: 'clamp(40px, 7vw, 80px)',
            lineHeight: 1.08, marginBottom: 22,
            maxWidth: 860, letterSpacing: '-0.02em',
          }}
        >
          ตามรอย<span className="gold-text">ภาพยนตร์</span><br />ในสถานที่จริง
        </h1>

        {/* Sub */}
        <p
          className="animate-fadeUp d3"
          style={{
            position: 'relative', zIndex: 2,
            fontSize: 22, color: '#BFC0C1',
            maxWidth: 620, lineHeight: 1.8, marginBottom: 44,
          }}
        >
          ค้นพบสถานที่ถ่ายทำหนังและซีรีส์ไทยที่คุณชื่นชอบ<br />
          พร้อมรีวิวจากผู้ที่ไปตามรอยจริง
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="animate-fadeUp d4"
          style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 560 }}
        >
          <input
            type="text"
            placeholder="ค้นหาภาพยนตร์, ฉาก, สถานที่..."
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', padding: '17px 28px', paddingLeft: 58, paddingRight: 140,
              background: '#FFFFFF', backdropFilter: 'blur(12px)',
              border: '1px solid #C6C8CA', borderRadius: 50,
              color: '#4A4A4A', fontSize: 15, outline: 'none',
              transition: 'border-color .2s, box-shadow .2s',
              fontFamily: "inherit",
            }}
            onFocus={e => { e.target.style.borderColor = '#E6A275'; e.target.style.boxShadow = '0 0 0 4px rgba(230, 162, 117, 0.12)'; }}
            onBlur={e  => { e.target.style.borderColor = '#C6C8CA'; e.target.style.boxShadow = 'none'; }}
          />
          <Search size={22} color="#C6C8CA" style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <button
            type="submit"
            className="btn-gold"
            style={{ position: 'absolute', right: 7, top: 7, bottom: 7, padding: '0 26px', borderRadius: 40, fontSize: 15 }}
          >
            ค้นหา
          </button>
        </form>

        {/* Stats row */}
        <div
          className="animate-fadeUp d5"
          style={{ position: 'relative', zIndex: 2, marginTop: 48, display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { num: popMovies.length + '+', label: 'ภาพยนตร์' },
            { num: popLocations.length + '+', label: 'สถานที่' },
            { num: '100+', label: 'รีวิว' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div className="font-serif gold-text" style={{ fontSize: 42, fontWeight: 900, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 16, color: '#BFC0C1', marginTop: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 100px' }}>

        {/* Movies section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 12, color: '#E6A275', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Featured</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(24px,3vw,34px)', margin: 0, color: '#D49B74' }}>
              ภาพยนตร์<span className="gold-text">ยอดฮิต</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/movies')}
            className="btn-ghost"
            style={{ borderRadius: 30, padding: '10px 24px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ดูทั้งหมด <ChevronRight size={18} />
          </button>
        </div>

        <div className="movie-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 22 }}>
          {popMovies.map((m, i) => (
            <div
              key={m.id}
              className={`card-hover animate-fadeUp d${i + 1}`}
              onClick={() => navigate(`/movies/${m.id}`)}
              style={{
                cursor: 'pointer', background: '#FFFFFF',
                border: '1px solid rgba(212, 155, 116, 0.15)',
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              <div style={{ height: 300, position: 'relative' }}>
                <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 55%, rgba(255,255,255,0.9))' }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge" style={{ fontSize: 11 }}>🎬 {m.genre || 'หนัง'}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                  <span style={{ background: 'rgba(230, 162, 117, 0.92)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>★ 4.8</span>
                </div>
              </div>
              <div style={{ padding: '20px 22px 22px' }}>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#4A4A4A' }}>
                  {m.title}
                </div>
                <div style={{ color: '#BFC0C1', fontSize: 16 }}>{m.releaseYear} • {m.genre || 'ภาพยนตร์'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Locations section */}
        <div style={{ marginTop: 96 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: '#E8A020', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Explore</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(24px,3vw,34px)', margin: 0 }}>
              สถานที่<span className="gold-text">ยอดนิยม</span>
            </h2>
          </div>

          <div className="scene-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
            {popLocations.map((l, i) => (
              <div
                key={l.id}
                className={`card-hover animate-fadeUp d${i + 1}`}
                onClick={() => navigate(`/location/${l.id}`)}
                style={{
                  cursor: 'pointer', background: '#FFFFFF',
                  border: '1px solid rgba(212, 155, 116, 0.15)',
                  borderRadius: 18, overflow: 'hidden',
                }}
              >
                <div style={{ padding: '28px 28px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'rgba(230, 162, 117, 0.12)',
                      border: '1px solid rgba(230, 162, 117, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E6A275'
                    }}>
                      <MapPin size={24} />
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: 11 }}>{l.province}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 12, color: '#4A4A4A' }}>{l.name}</div>
                  <p style={{ fontSize: 16, color: '#666', lineHeight: 1.6, margin: 0 }}>
                    {l.description
                      ? (l.description.length > 90 ? l.description.substring(0, 90) + '…' : l.description)
                      : 'ไม่มีรายละเอียด'}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid rgba(212, 155, 116, 0.05)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, color: '#BFC0C1', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Heart size={15} /> บันทึกไว้ภายหลัง
                  </span>
                  <span style={{ fontSize: 15, color: '#E6A275', fontWeight: 600 }}>ดูรายละเอียด →</span>
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
