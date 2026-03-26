import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, Film } from 'lucide-react';
import { Shimmer, Particles } from '../components/UI';
import { MovieController } from '../services/db';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const db = MovieController.get(id);
      if (db) {
        setMovie(db);
        setScenes(MovieController.scenes(parseInt(id)));
      }
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px' }}>
        <Shimmer h={400} r={24} style={{ marginBottom: 40 }} />
        <Shimmer h={40} w="60%" style={{ marginBottom: 16 }} />
        <Shimmer h={20} w="80%" style={{ marginBottom: 8 }} />
        <Shimmer h={20} w="75%" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--muted)' }}>
        <h2>ไม่พบข้อมูลภาพยนตร์</h2>
        <button className="btn-ghost" onClick={() => navigate('/movies')} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 20 }}>
          <ArrowLeft size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> กลับไปหน้าภาพยนตร์
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 400 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(7,7,15,.4), #07070F)' }}></div>
        </div>
        <Particles count={15} />
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 60px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <button className="btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px 16px', borderRadius: 20, marginBottom: 24, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> ย้อนกลับ
            </button>
            <div className="animate-fadeUp d1">
              <span className="badge" style={{ marginBottom: 16 }}>🎬 {movie.genre || 'ภาพยนตร์'}</span>
              <h1 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 56px)', margin: '0 0 16px', lineHeight: 1.1 }}>{movie.title}</h1>
              <div style={{ display: 'flex', gap: 24, color: 'var(--muted)', fontSize: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} /> {movie.releaseYear}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> 120 นาที</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)' }}><span style={{ fontSize: 16 }}>★</span> 4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <div className="animate-fadeUp d2" style={{ marginBottom: 60 }}>
          <h2 className="font-serif" style={{ fontSize: 24, margin: '0 0 16px' }}>เรื่องย่อ</h2>
          <p style={{ color: '#A8A5B4', lineHeight: 1.8, fontSize: 16, maxWidth: 800 }}>{movie.description}</p>
        </div>

        <div className="animate-fadeUp d3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 className="font-serif" style={{ fontSize: 28, margin: 0 }}>
              สถานที่<span className="gold-text">ถ่ายทำ</span>
            </h2>
            <span className="badge badge-gray">{scenes.length} สถานที่</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {scenes.length > 0 ? (
              scenes.map(scene => (
                <div key={scene.id} className="card-hover" onClick={() => navigate(`/location/${scene.locationId}`)}
                  style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ height: 200, position: 'relative' }}>
                    <img src={scene.imgUrl || `https://picsum.photos/400/250?scene=${scene.id}`} alt="scene" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 60%, rgba(13,13,26,.9))' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <MapPin size={18} color="var(--gold)" />
                      <div style={{ fontWeight: 600, fontSize: 15 }}>ดูรายละเอียดสถานที่</div>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                      <Film size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}/>
                      ฉาก: {scene.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,.1)' }}>
                <p style={{ color: 'var(--muted)' }}>ยังไม่มีข้อมูลสถานที่ถ่ายทำสำหรับภาพยนตร์เรื่องนี้</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
