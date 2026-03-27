import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, MessagesSquare, Map, Star, Compass } from 'lucide-react';
import { Shimmer, LeafletMap, Stars, Field } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { LocationController, AdController, ReviewController, MovieController } from '../services/db';

const LocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toast } = useAppContext();

  const [loc, setLoc] = useState(null);
  const [ads, setAds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(0);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const parsedId = parseInt(id);
      const data = LocationController.get(parsedId);
      if (data) {
        setLoc(data);
        document.title = `Move³Movie | ${data.name || 'สถานที่'}`;
        setAds(AdController.list().filter(a => !a.hidden)); // In a real app, distance based
        setReviews(ReviewController.list(parsedId));

        // Find movies featuring this location
        const dbMovies = MovieController.list();
        const relatedMovies = dbMovies.filter(m => MovieController.scenes(m.id).some(s => s.locationId === parsedId));
        setMovies(relatedMovies);
      }
      setLoading(false);
    }, 400);

    return () => { document.title = 'Move³Movie'; };
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast('กรุณาเข้าสู่ระบบก่อนเขียนรีวิว', 'error');
    if (!reviewText || !reviewStars) return toast('กรุณาระบุคะแนนและข้อความ', 'error');

    try {
      const nw = await ReviewController.add({ userId: user.id, userName: user.name, locationId: parseInt(id), rating: reviewStars, comment: reviewText });
      setReviews(prev => [nw, ...prev]);
      setReviewText(''); setReviewStars(0);
      toast('บันทึกรีวิวสำเร็จ');
    } catch (err) {
      toast('เกิดข้อผิดพลาด: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto mt-[140px] mb-[100px] px-6">
        <Shimmer h={40} w="60%" className="mb-5" />
        <Shimmer h={200} className="mb-10" />
        <Shimmer h={100} className="mb-5" />
      </div>
    );
  }

  if (!loc) {
    return (
      <div className="text-center py-[120px] px-5 text-muted">
        <h2 className="font-serif text-[24px]">ไม่พบข้อมูลสถานที่</h2>
        <button className="btn-ghost px-6 py-2.5 rounded-[20px] mt-5 inline-flex items-center gap-2" onClick={() => navigate('/map')}>
          กลับไปหน้าแผนที่
        </button>
      </div>
    );
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="max-w-[1000px] mx-auto pt-[100px] pb-[60px] px-6">
      <button className="btn-ghost px-4 py-2 rounded-[20px] mb-6 text-[13px] inline-flex items-center gap-1.5" onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> ย้อนกลับ
      </button>

      <div className="animate-fade-up">
        
        <div className="flex flex-col md:flex-row gap-10 mb-[60px]">

          <div className="flex-1">
            <div className="flex gap-3 mb-4">
              <span className="badge"><MapPin size={12} className="inline mr-1" /> {loc.province}</span>
              {loc.type && <span className="badge badge-gray"><Tag size={12} className="inline mr-1" /> {loc.type}</span>}
              <span className="badge bg-gold/10 border-gold/20 text-gold"><Star size={12} className="inline mr-1" /> {avgRating}</span>
            </div>

            <h1 className="font-serif text-[clamp(32px,4vw,42px)] m-0 mb-4 leading-[1.2]">{loc.name}</h1>
            <p className="text-[#A8A5B4] leading-[1.85] text-[15px] mb-9 max-w-[680px]">
              {loc.description || 'ไม่มีคำอธิบาย'}
            </p>

            {loc.lat && loc.lng && (
              <div className="mb-10">
                <LeafletMap locations={[loc]} center={[loc.lat, loc.lng]} zoom={15} height={300} />
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold inline-flex items-center gap-2.5 px-6 py-3 rounded-xl no-underline font-semibold text-[15px]"
                  >
                    <Map size={18} /> นำทางด้วย Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Ads Panel */}
            {ads.length > 0 && (
              <div className="bg-gradient-to-tr from-gold/5 lg:via-gold/10 lg:to-gold/5 border border-gold/20 rounded-2xl p-6 mb-10">
                <h3 className="font-serif text-gold text-[18px] mb-4 flex items-center gap-2">
                  <Compass size={18} /> สถานที่หรือโปรโมชั่นใกล้เคียง
                </h3>
                <div className="grid gap-4">
                  {ads.slice(0, 2).map(ad => (
                    <div key={ad.id} className="bg-[#07070F]/60 rounded-xl p-4">
                      <div className="font-semibold text-main mb-1">{ad.title}</div>
                      <div className="text-[13px] text-muted">{ad.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="w-full max-w-[320px] max-md:max-w-none">
            
            {/* Related Movies */}
            <div className="bg-card border border-white/5 rounded-2xl p-6 mb-6">
              <h3 className="font-serif text-[18px] mb-4">ปรากฏในภาพยนตร์</h3>
              {movies.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {movies.map(m => (
                    <div key={m.id} onClick={() => navigate(`/movies/${m.id}`)}
                      className="flex gap-3 items-center cursor-pointer p-2 rounded-lg transition-colors hover:bg-white/5">
                      <img src={m.poster} alt={m.title} className="w-11 h-[62px] rounded border border-white/10 object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-main truncate">{m.title}</div>
                        <div className="text-[12px] text-muted">{m.releaseYear}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[13px] text-muted">ไม่มีข้อมูลภาพยนตร์ที่แนบกับสถานที่นี้</div>
              )}
            </div>

            {/* Review Form */}
            <div className="bg-card border border-white/5 rounded-2xl p-6">
              <h3 className="font-serif text-[18px] mb-4">เขียนรีวิว</h3>
              {user ? (
                <form onSubmit={submitReview}>
                  <div className="mb-4">
                    <Stars val={reviewStars} onChange={setReviewStars} size={24} />
                  </div>
                  <Field>
                    <textarea placeholder="บรรยากาศเป็นอย่างไรบ้าง..." className="inp min-h-[100px]" value={reviewText} onChange={e => setReviewText(e.target.value)} />
                  </Field>
                  <button type="submit" className="btn-gold w-full py-3 rounded-xl mt-2 text-[14px]">ยืนยันรีวิว</button>
                </form>
              ) : (
                <div className="text-center py-5">
                  <p className="text-[13px] text-muted mb-4">กรุณาเข้าสู่ระบบเพื่อเขียนรีวิวแชร์ประสบการณ์</p>
                  <button onClick={() => navigate('/auth')} className="btn-ghost px-5 py-2 rounded-xl text-[13px]">เข้าสู่ระบบ</button>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Reviews List */}
        <div className="border-t border-white/5 pt-10">
          <h2 className="font-serif text-[24px] mb-6">รีวิวจากผู้ใช้งาน ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                {reviews.map(r => {
                  const dateVal = r.createdAt || r.createdat;
                  const nameVal = r.userName || r.username || 'ผู้ใช้แอป';
                  
                  return (
                    <div key={r.id} className="bg-card border border-white/5 rounded-2xl p-5 md:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center font-semibold text-[14px]">
                            {nameVal.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-[14px]">{nameVal}</div>
                            <div className="text-[12px] text-muted">
                              {dateVal ? new Date(dateVal).toLocaleDateString('th-TH') : 'เมื่อสักครู่'}
                            </div>
                          </div>
                        </div>
                        <Stars val={r.rating} size={14} readonly />
                      </div>
                      <p className="text-[#EDE9E3] text-[14px] leading-[1.6] m-0">"{r.comment}"</p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-10 text-center bg-card rounded-2xl border border-dashed border-white/10">
              <MessagesSquare size={32} className="text-muted mx-auto mb-3" />
              <div className="text-main mb-1">ยังไม่มีรีวิว</div>
              <div className="text-muted text-[13px]">เป็นคนแรกที่แชร์ประสบการณ์สิ!</div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default LocationPage;