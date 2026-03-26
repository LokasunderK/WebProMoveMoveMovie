import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Popcorn } from 'lucide-react';
import { MovieCardSkeleton } from '../components/UI';
import { MovieController } from '../services/db';

const MoviesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initQ = queryParams.get('q') || '';
  
  const [q, setQ] = useState(initQ);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const results = MovieController.list();
    const filtered = q 
      ? results.filter(m => m.title.toLowerCase().includes(q.toLowerCase()) || m.description?.toLowerCase().includes(q.toLowerCase()))
      : results;
    
    setTimeout(() => {
      setMovies(filtered);
      setLoading(false);
    }, 400); // simulate network delay for shimmer
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/movies?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 60px' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: 600, margin: '0 0 40px' }}>
        <input
          type="text"
          placeholder="ค้นหาชื่อภาพยนตร์..."
          value={q} onChange={e => setQ(e.target.value)}
          className="inp"
          style={{ padding: '16px 24px', paddingLeft: 54, borderRadius: 30, fontSize: 16 }}
        />
        <Search size={22} color="var(--muted)" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <h2 className="font-serif" style={{ fontSize: 32, margin: 0 }}>ภาพยนตร์<span className="gold-text">ทั้งหมด</span></h2>
        <span className="badge badge-gray">{movies.length} เรื่อง</span>
      </div>

      <div className="movie-grid">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <MovieCardSkeleton key={i} />)
        ) : movies.length > 0 ? (
          movies.map(m => (
            <div key={m.id} className="card-hover d2" onClick={() => navigate(`/movies/${m.id}`)}
              style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 280, position: 'relative' }}>
                <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(7,7,15,.9))' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                  <span style={{ background: 'rgba(232,160,32,.9)', color: '#07070F', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>★ 4.8</span>
                </div>
              </div>
              <div style={{ padding: '14px 15px' }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{m.releaseYear} • {m.genre || 'ทั่วไป'}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 16, border: '1px dashed rgba(255,255,255,.1)' }}>
            <Popcorn size={48} color="rgba(255,255,255,.1)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>ไม่พบภาพยนตร์ที่ค้นหา</div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>ลองใช้คำค้นหาอื่นดูสิ!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
