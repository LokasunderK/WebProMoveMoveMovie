import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, Film } from 'lucide-react';
import { Shimmer, Particles } from '../components/UI';
import { MovieController, LocationController } from '../services/db';

const MovieDetailPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [movie,   setMovie]   = useState(null);
  const [scenes,  setScenes]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const db = MovieController.get(id);
      if (db) {
        setMovie(db);
        document.title = `Move³Movie | ${db.title || 'หนัง'}`;
        setScenes(MovieController.scenes(parseInt(id)));
      }
      setLoading(false);
    }, 400);
    return () => { document.title = 'Move³Movie'; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '100px auto 0', padding: '0 24px' }}>
        <Shimmer h={400} r={24} style={{ marginBottom: 40 }} />
        <Shimmer h={40} w="60%" style={{ marginBottom: 16 }} />
        <Shimmer h={20} w="80%" style={{ marginBottom: 8 }} />
        <Shimmer h={20} w="75%" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: '#7A7990' }}>
        <h2 className="font-serif" style={{ marginBottom: 20 }}>ไม่พบข้อมูลภาพยนตร์</h2>
        <button
          className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 30 }}
          onClick={() => navigate('/movies')}
        >
          <ArrowLeft size={16} /> กลับไปหน้าภาพยนตร์
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 450 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(254, 245, 231, 0.3), #FEF5E7)' }} />
        </div>
        <Particles count={15} />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 60px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <button
              className="btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, marginBottom: 24, fontSize: 13 }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={14} /> ย้อนกลับ
            </button>

            <div className="animate-fadeUp d1">
              <span className="badge" style={{ marginBottom: 16 }}>🎬 {movie.genre || 'ภาพยนตร์'}</span>
              <h1 className="font-serif" style={{ fontSize: 'clamp(32px,5vw,56px)', margin: '0 0 16px', lineHeight: 1.1, color: '#D49B74', fontWeight: 900 }}>
                {movie.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, color: '#4A4A4A', fontSize: 18, fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={18} /> {movie.releaseYear}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={18} /> 120 นาที</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#E6A275' }}><span style={{ fontSize: 20 }}>★</span> 4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 80px' }}>

        <div className="animate-fadeUp d2" style={{ marginBottom: 60 }}>
          <h2 className="font-serif" style={{ fontSize: 28, margin: '0 0 16px', color: '#D49B74' }}>เรื่องย่อ</h2>
          <p style={{ color: '#4A4A4A', lineHeight: 1.8, fontSize: 18, maxWidth: 860, margin: 0 }}>
            {movie.description}
          </p>
        </div>

        <div className="animate-fadeUp d3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <h2 className="font-serif" style={{ fontSize: 28, margin: 0 }}>
              สถานที่<span className="gold-text">ถ่ายทำ</span>
            </h2>
            <span className="badge badge-gray">{scenes.length} สถานที่</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {scenes.length > 0 ? (
              scenes.map(scene => {
                const locData = LocationController.get(scene.locationId);
                const locName = locData ? locData.name : 'ดูรายละเอียดสถานที่';
                return (
                  <div
                    key={scene.id}
                    className="card-hover"
                    onClick={() => navigate(`/location/${scene.locationId}`)}
                    style={{
                      cursor: 'pointer', background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)',
                      borderRadius: 16, overflow: 'hidden'
                    }}
                  >
                    <div style={{ height: 200, position: 'relative' }}>
                      <img src={scene.imgUrl || `https://picsum.photos/400/250?scene=${scene.id}`} alt="scene" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(254, 245, 231, 0.6), transparent 60%)' }} />
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <MapPin size={18} color="#E6A275" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontWeight: 700, fontSize: 18, color: '#4A4A4A' }}>{locName}</div>
                      </div>
                      <p style={{ color: '#BFC0C1', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                        <Film size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                        ฉาก: {scene.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: 60, textAlign: 'center', background: 'rgba(255,255,255,.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,.1)' }}>
                <p style={{ color: '#7A7990', margin: 0 }}>ยังไม่มีข้อมูลสถานที่ถ่ายทำสำหรับภาพยนตร์เรื่องนี้</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default MovieDetailPage;
