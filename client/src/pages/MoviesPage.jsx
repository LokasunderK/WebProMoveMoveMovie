import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Popcorn } from 'lucide-react';
import { MovieCardSkeleton } from '../components/UI';
import { MovieController } from '../services/db';

const MoviesPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const initQ     = new URLSearchParams(location.search).get('q') || '';

  const [q,       setQ]       = useState(initQ);
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const results  = MovieController.list();
    const filtered = q
      ? results.filter(m =>
          m.title.toLowerCase().includes(q.toLowerCase()) ||
          m.description?.toLowerCase().includes(q.toLowerCase()))
      : results;
    setTimeout(() => { setMovies(filtered); setLoading(false); }, 400);
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/movies?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 24px 80px' }}>

      {/* Heading */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, color: '#E6A275', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
          Library
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', margin: 0, color: '#D49B74' }}>
            ภาพยนตร์<span className="gold-text">ทั้งหมด</span>
          </h1>
          {!loading && <span className="badge badge-gray" style={{ fontSize: 16 }}>{movies.length} เรื่อง</span>}
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: 600, marginBottom: 40 }}>
        <input
          type="text"
          placeholder="ค้นหาชื่อภาพยนตร์..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="inp"
          style={{ padding: '15px 24px', paddingLeft: 54, borderRadius: 30, fontSize: 18 }}
        />
        <Search size={24} color="#BFC0C1" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </form>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 22 }}>
        {loading ? (
          [1,2,3,4,5,6,8].map(i => <MovieCardSkeleton key={i} />)
        ) : movies.length > 0 ? (
          movies.map(m => (
            <div
              key={m.id}
              className="card-hover"
              onClick={() => navigate(`/movies/${m.id}`)}
              style={{
                cursor: 'pointer', background: '#FFFFFF',
                border: '1px solid rgba(212, 155, 116, 0.15)',
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              <div style={{ height: 290, position: 'relative' }}>
                <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 55%, rgba(255,255,255,0.9))' }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge" style={{ fontSize: 10 }}>🎬 {m.genre || 'หนัง'}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
                  <span style={{ background: 'rgba(230, 162, 117, 0.92)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>★ 4.8</span>
                </div>
              </div>
              <div style={{ padding: '20px 18px 22px' }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#4A4A4A' }}>
                  {m.title}
                </div>
                <div style={{ color: '#BFC0C1', fontSize: 14 }}>{m.releaseYear} · {m.genre || 'ทั่วไป'}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1', padding: '80px 20px',
            textAlign: 'center', background: '#FFFFFF',
            borderRadius: 20, border: '1px dashed rgba(212, 155, 116, 0.2)'
          }}>
            <Popcorn size={52} color="#BFC0C1" style={{ margin: '0 auto 20px', opacity: 0.3 }} />
            <div style={{ fontSize: 20, color: '#4A4A4A', marginBottom: 10, fontFamily: "inherit", fontWeight: 700 }}>ไม่พบภาพยนตร์ที่ค้นหา</div>
            <div style={{ color: '#BFC0C1', fontSize: 14 }}>ลองใช้คำค้นหาอื่นดูสิ!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
