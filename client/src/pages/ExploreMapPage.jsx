import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletMap } from '../components/UI';
import { Map, Star, MapPin, Film } from 'lucide-react';
import { LocationController, MovieController, ReviewController } from '../services/db';

const ExploreMapPage = () => {
  const navigate = useNavigate();
  const rawLocs  = LocationController.list();
  const locs     = useMemo(() => rawLocs.filter(l => !l.hidden), [rawLocs]);

  const locsWithMovies = useMemo(() => locs.map(loc => {
    const revs      = ReviewController.list(loc.id);
    const avgRating = revs.length > 0
      ? (revs.reduce((a, r) => a + r.rating, 0) / revs.length).toFixed(1)
      : null;
    const movies    = MovieController.list();
    const movie     = movies.find(m => MovieController.scenes(m.id).some(s => s.locationId === loc.id));
    return { ...loc, movieTitle: movie?.title || 'ไม่ระบุ', avgRating };
  }), [locs]);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 24px 80px' }}>
      <div className="animate-fadeUp">

        {/* Heading */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 16, color: '#E6A275', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            Explore
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(32px,5vw,48px)', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 14, color: '#D49B74' }}>
            <MapPin size={38} color="#D49B74" />
            สำรวจ<span className="gold-text">แผนที่</span>
          </h1>
          <p style={{ color: '#BFC0C1', fontSize: 18, margin: 0, fontWeight: 500 }}>
            สถานที่ถ่ายทำภาพยนตร์ทั้งหมดบนแผนที่ — คลิกหมุดเพื่อดูรายละเอียด
          </p>
        </div>

        {/* Map */}
        <div style={{ marginBottom: 48 }}>
          <LeafletMap
            locations={locsWithMovies}
            zoom={7}
            height={500}
            onMarkerClick={loc => navigate(`/location/${loc.id}`)}
          />
        </div>

        {/* List */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <h2 className="font-serif" style={{ fontSize: 28, margin: 0, display: 'flex', alignItems: 'center', gap: 10, color: '#D49B74' }}>
            <MapPin size={24} color="#D49B74" />
            สถานที่ทั้งหมด
          </h2>
          <span className="badge badge-gray" style={{ fontSize: 16 }}>{locs.length} แห่ง</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {locsWithMovies.map(loc => (
            <div
              key={loc.id}
              className="card-hover"
              onClick={() => navigate(`/location/${loc.id}`)}
              style={{
                cursor: 'pointer', background: '#FFFFFF',
                border: '1px solid rgba(212, 155, 116, 0.15)',
                borderRadius: 16, padding: '24px 28px',
                display: 'flex', gap: 20, alignItems: 'center',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 54, height: 54, borderRadius: 14, flexShrink: 0,
                background: 'rgba(230, 162, 117, 0.12)', border: '1px solid rgba(230, 162, 117, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E6A275',
              }}>
                <MapPin size={26} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 22, color: '#4A4A4A', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {loc.name}
                </div>
                <div style={{ color: '#BFC0C1', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span>{loc.province}</span>
                  <span style={{ opacity: .4 }}>·</span>
                  <Film size={15} color="#E6A275" />
                  <span className="gold-text" style={{ fontSize: 18, fontWeight: 700 }}>{loc.movieTitle}</span>
                </div>
              </div>

              {/* Rating */}
              {loc.avgRating && (
                <div style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(230, 162, 117, 0.12)', border: '1px solid rgba(230, 162, 117, 0.25)',
                  borderRadius: 12, padding: '6px 14px', fontSize: 18, color: '#E6A275', fontWeight: 800,
                }}>
                  <Star size={16} fill="#E6A275" /> {loc.avgRating}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ExploreMapPage;
