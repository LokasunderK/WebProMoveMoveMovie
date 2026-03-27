import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletMap } from '../components/UI';
import { Map, Star, MapPin } from 'lucide-react';
import { LocationController, MovieController, ReviewController } from '../services/db';

const ExploreMapPage = () => {
  const navigate = useNavigate();
  const rawLocs = LocationController.list();
  
  const locs = useMemo(() => rawLocs.filter(l => !l.hidden), [rawLocs]);
  
  const locsWithMovies = useMemo(() => locs.map(loc => {
    const revs = ReviewController.list(loc.id);
    const avgRating = revs.length > 0 ? (revs.reduce((a, r) => a + r.rating, 0) / revs.length).toFixed(1) : null;
    
    const movies = MovieController.list();
    const movie = movies.find(m => MovieController.scenes(m.id).some(s => s.locationId === loc.id));
    
    return { ...loc, movieTitle: movie?.title || 'ไม่ระบุ', avgRating };
  }), [locs]);

  return (
    <div className="max-w-[1200px] mx-auto pt-[100px] px-6 pb-16">
      <div className="animate-fade-up">
        
        <h1 className="font-serif text-[42px] m-0 mb-1.5 flex items-center gap-3">
          <Map size={36} className="text-gold" /> สำรวจ<span className="gold-text">แผนที่</span>
        </h1>
        <p className="text-muted mb-8 text-[15px]">
          สถานที่ถ่ายทำภาพยนตร์ทั้งหมดบนแผนที่ — คลิกหมุดเพื่อดูรายละเอียด
        </p>
        
        <div className="mb-9">
          <LeafletMap
            locations={locsWithMovies}
            zoom={7}
            height={480}
            onMarkerClick={(loc) => navigate(`/location/${loc.id}`)}
          />
        </div>
        
        <h2 className="font-serif text-[24px] m-0 mt-9 mb-4 flex items-center gap-2">
          <MapPin size={22} className="text-gold" />
          สถานที่ทั้งหมด ({locs.length})
        </h2>
        
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
          {locsWithMovies.map(loc => (
            <div key={loc.id} className="card-hover delay-200 bg-card border border-white/5 rounded-[14px] p-[18px_20px] flex gap-3.5 items-center cursor-pointer" onClick={() => navigate(`/location/${loc.id}`)}>
              
              <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <MapPin size={22} />
              </div>
              
              <div className="min-w-0">
                <div className="font-semibold text-[14px] mb-1 text-main truncate">{loc.name}</div>
                <div className="text-muted text-[12px] truncate">{loc.province} • <span className="gold-text">🎬 {loc.movieTitle}</span></div>
              </div>
              
              <div className="ml-auto shrink-0 pl-2">
                {loc.avgRating && (
                  <span className="inline-flex items-center gap-1 bg-gold/10 rounded-lg px-2.5 py-1 text-[13px] text-gold font-bold">
                    <Star size={12} className="fill-gold" /> {loc.avgRating}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default ExploreMapPage;
