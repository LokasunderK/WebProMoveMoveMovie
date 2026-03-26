import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletMap } from '../components/UI';
import { Map, Star, MapPin } from 'lucide-react';
import { LocationController, MovieController, ReviewController } from '../services/db';

const ExploreMapPage = () => {
  const navigate = useNavigate();
  const rawLocs = LocationController.list();
  
  // Exclude hidden locations globally unless admin? Client specifies "hide what can be approved" 
  // Let's hide `.hidden === true` for regular users mapping.
  const locs = useMemo(() => rawLocs.filter(l => !l.hidden), [rawLocs]);
  
  const locsWithMovies = useMemo(() => locs.map(loc => {
    // Determine the average review rating
    const revs = ReviewController.list(loc.id);
    const avgRating = revs.length > 0 ? (revs.reduce((a, r) => a + r.rating, 0) / revs.length).toFixed(1) : null;
    
    // Find associated movie Title if it acts as a scene
    const movies = MovieController.list();
    const movie = movies.find(m => MovieController.scenes(m.id).some(s => s.locationId === loc.id));
    
    return { ...loc, movieTitle: movie?.title || 'ไม่ระบุ', avgRating };
  }), [locs]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 64px' }}>
      <div className="animate-fadeUp">
        <h1 className="font-serif" style={{ fontSize: 42, margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Map size={36} color="var(--gold)" /> สำรวจ<span className="gold-text">แผนที่</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>
          สถานที่ถ่ายทำภาพยนตร์ทั้งหมดบนแผนที่ — คลิกหมุดเพื่อดูรายละเอียด
        </p>
        
        <LeafletMap
          locations={locsWithMovies}
          zoom={7}
          height={480}
          onMarkerClick={(loc) => navigate(`/location/${loc.id}`)}
        />
        
        <h2 className="font-serif" style={{ fontSize: 24, margin: '36px 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={22} color="var(--gold)" />
          สถานที่ทั้งหมด ({locs.length})
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {locsWithMovies.map(loc => (
            <div key={loc.id} className="card-hover d2" onClick={() => navigate(`/location/${loc.id}`)}
              style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
              
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(232,160,32,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: 'var(--text)' }}>{loc.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{loc.province} • <span className="gold-text">🎬 {loc.movieTitle}</span></div>
              </div>
              
              <div style={{ marginLeft: 'auto' }}>
                {loc.avgRating && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(232,160,32,.12)', borderRadius: 8, padding: '3px 10px', fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>
                    <Star size={12} fill="var(--gold)" /> {loc.avgRating}
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
