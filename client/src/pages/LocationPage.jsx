import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, MessagesSquare, Map, Star, Compass, Film } from 'lucide-react';
import { Shimmer, LeafletMap, Stars, Field } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { LocationController, AdController, ReviewController, MovieController } from '../services/db';

const LocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toast } = useAppContext();

  const [loc,     setLoc]     = useState(null);
  const [ads,     setAds]     = useState([]);
  const [reviews, setReviews] = useState([]);
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewText,  setReviewText]  = useState('');
  const [reviewStars, setReviewStars] = useState(0);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const parsedId = parseInt(id);
      const data = LocationController.get(parsedId);
      if (data) {
        setLoc(data);
        document.title = `Move³Movie | ${data.name || 'สถานที่'}`;
        setAds(AdController.list().filter(a => !a.hidden));
        setReviews(ReviewController.list(parsedId));
        const dbMovies  = MovieController.list();
        const relatedMovies = dbMovies.filter(m => MovieController.scenes(m.id).some(s => s.locationId === parsedId));
        setMovies(relatedMovies);
      }
      setLoading(false);
    }, 400);
    return () => { document.title = 'Move³Movie'; };
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user)              return toast('กรุณาเข้าสู่ระบบก่อนเขียนรีวิว', 'error');
    if (!reviewText || !reviewStars) return toast('กรุณาระบุคะแนนและข้อความ', 'error');
    try {
      const nw = await ReviewController.add({
        userId: user.id, userName: user.name,
        locationId: parseInt(id), rating: reviewStars, comment: reviewText
      });
      setReviews(prev => [nw, ...prev]);
      setReviewText(''); setReviewStars(0);
      toast('บันทึกรีวิวสำเร็จ');
    } catch (err) {
      toast('เกิดข้อผิดพลาด: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '140px auto 100px', padding: '0 24px' }}>
        <Shimmer h={40} w="60%" style={{ marginBottom: 20 }} />
        <Shimmer h={200} style={{ marginBottom: 40 }} />
        <Shimmer h={100} style={{ marginBottom: 20 }} />
      </div>
    );
  }

  if (!loc) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: '#BFC0C1' }}>
        <h2 className="font-serif" style={{ marginBottom: 20 }}>ไม่พบข้อมูลสถานที่</h2>
        <button className="btn-ghost" style={{ padding: '10px 24px', borderRadius: 20 }} onClick={() => navigate('/map')}>
          กลับไปหน้าแผนที่
        </button>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '110px 24px 80px' }}>
      
      <button
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, marginBottom: 24, fontSize: 13 }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={14} /> ย้อนกลับ
      </button>

      <div className="animate-fadeUp">
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 60 }}>
          
          {/* Left Column */}
          <div style={{ flex: '1 1 500px', minWidth: 300 }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <span className="badge"><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{loc.province}</span>
              {loc.type && <span className="badge badge-gray"><Tag size={12} style={{ display: 'inline', marginRight: 4 }} />{loc.type}</span>}
              <span className="badge" style={{ background: 'rgba(230, 162, 117, 0.09)', color: '#E6A275', borderColor: 'rgba(230, 162, 117, 0.25)' }}>
                <Star size={12} style={{ display: 'inline', marginRight: 4 }} />{avgRating}
              </span>
            </div>

            <h1 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 42px)', margin: '0 0 16px', lineHeight: 1.1, color: '#D49B74', fontWeight: 800 }}>
              {loc.name}
            </h1>

            <p style={{ color: '#4A4A4A', lineHeight: 1.7, fontSize: 18, marginBottom: 36, maxWidth: 680 }}>
              {loc.description || 'ไม่มีคำอธิบาย'}
            </p>

            {loc.lat && loc.lng && (
              <div style={{ marginBottom: 40 }}>
                <LeafletMap locations={[loc]} center={[loc.lat, loc.lng]} zoom={15} height={320} />
                <div style={{ marginTop: 16 }}>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 12, fontSize: 15 }}
                  >
                    <Map size={18} /> นำทางด้วย Google Maps
                  </a>
                </div>
              </div>
            )}

            {ads.length > 0 && (
              <div style={{ background: 'rgba(230, 162, 117, 0.06)', border: '1px solid rgba(230, 162, 117, 0.2)', borderRadius: 16, padding: 24, marginBottom: 40 }}>
                <h3 className="font-serif" style={{ color: '#E6A275', fontSize: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Compass size={18} /> สถานที่หรือโปรโมชั่นใกล้เคียง
                </h3>
                <div style={{ display: 'grid', gap: 16 }}>
                  {ads.slice(0, 2).map(ad => (
                    <div key={ad.id} style={{ background: '#FFFFFF', borderRadius: 12, padding: 16, border: '1px solid rgba(212, 155, 116, 0.1)' }}>
                      <div style={{ fontWeight: 600, color: '#4A4A4A', marginBottom: 4 }}>{ad.title}</div>
                      <div style={{ fontSize: 13, color: '#BFC0C1' }}>{ad.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column */}
          <div style={{ flex: '1 1 320px', maxWidth: 400 }}>
            {/* Related Movies */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 className="font-serif" style={{ fontSize: 18, marginBottom: 16, color: '#D49B74' }}>ปรากฏในภาพยนตร์</h3>
              {movies.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {movies.map(m => (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/movies/${m.id}`)}
                      style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background .2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(230, 162, 117, 0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <img src={m.poster} alt={m.title} style={{ width: 50, height: 70, borderRadius: 6, objectFit: 'cover' }} />
                      <div>
                         <div style={{ fontSize: 18, fontWeight: 700, color: '#4A4A4A', lineHeight: 1.2 }}>{m.title}</div>
                        <div style={{ fontSize: 13, color: '#BFC0C1' }}>{m.releaseYear}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#BFC0C1' }}>ไม่มีข้อมูลภาพยนตร์ที่แนบกับสถานที่นี้</div>
              )}
            </div>

            {/* Review Form */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)', borderRadius: 16, padding: 24 }}>
              <h3 className="font-serif" style={{ fontSize: 18, marginBottom: 16, color: '#D49B74' }}>เขียนรีวิว</h3>
              {user ? (
                <form onSubmit={submitReview}>
                  <div style={{ marginBottom: 16 }}><Stars val={reviewStars} onChange={setReviewStars} size={24} /></div>
                  <Field>
                    <textarea
                      placeholder="บรรยากาศเป็นอย่างไรบ้าง..."
                      className="inp"
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                    />
                  </Field>
                  <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px 0', borderRadius: 10 }}>ยืนยันรีวิว</button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: 13, color: '#BFC0C1', marginBottom: 16 }}>กรุณาเข้าสู่ระบบเพื่อเขียนรีวิวแชร์ประสบการณ์</p>
                  <button onClick={() => navigate('/auth')} className="btn-ghost" style={{ padding: '8px 20px', borderRadius: 10, fontSize: 13 }}>
                    เข้าสู่ระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div style={{ borderTop: '1px solid rgba(212, 155, 116, 0.1)', paddingTop: 40 }}>
          <h2 className="font-serif" style={{ fontSize: 24, marginBottom: 24, color: '#D49B74' }}>รีวิวจากผู้ใช้งาน ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {reviews.map(r => {
                const dateVal = r.createdAt || r.createdat;
                const nameVal = r.userName || r.username || 'ผู้ใช้แอป';
                return (
                  <div key={r.id} style={{ background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)', borderRadius: 16, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(230, 162, 117, 0.1)', color: '#E6A275', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexShrink: 0 }}>
                          {nameVal.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16, color: '#4A4A4A' }}>{nameVal}</div>
                          <div style={{ fontSize: 12, color: '#BFC0C1' }}>
                            {dateVal ? new Date(dateVal).toLocaleDateString('th-TH') : 'เมื่อสักครู่'}
                          </div>
                        </div>
                      </div>
                      <Stars val={r.rating} size={15} readonly />
                    </div>
                    <p style={{ color: '#4A4A4A', fontSize: 16, lineHeight: 1.6, margin: 0 }}>"{r.comment}"</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: 16, border: '1px dashed rgba(212, 155, 116, 0.2)' }}>
              <MessagesSquare size={32} color="#BFC0C1" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: '#4A4A4A', marginBottom: 4 }}>ยังไม่มีรีวิว</div>
              <div style={{ color: '#BFC0C1', fontSize: 13 }}>เป็นคนแรกที่แชร์ประสบการณ์สิ!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPage;