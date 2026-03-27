import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

/* ── Particles ── */
export const Particles = ({ count = 20 }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    })), [count]);
  return (
    <div className="particles">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.left}%`, width: p.size, height: p.size,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
          opacity: p.opacity
        }} />
      ))}
    </div>
  );
};

/* ── Shimmer skeleton ── */
export const Shimmer = ({ w = '100%', h = 200, r = 12, style = {} }) => (
  <div className="shimmer" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

/* ── Movie card skeleton ── */
export const MovieCardSkeleton = () => (
  <div className="bg-[var(--color-bg-card)] border border-white/[.06] rounded-2xl overflow-hidden">
    <Shimmer h={280} r={0} />
    <div className="p-[14px_15px]">
      <Shimmer h={18} w="70%" style={{ marginBottom: 8 }} />
      <Shimmer h={14} w="40%" style={{ marginBottom: 8 }} />
      <Shimmer h={12} w="90%" />
    </div>
  </div>
);

/* ── Leaflet Map ── */
export const LeafletMap = ({ locations = [], center, zoom = 13, height = 350, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const defaultCenter = center || (locations.length > 0
      ? [locations[0].lat, locations[0].lng]
      : [13.7563, 100.5018]);
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false })
      .setView(defaultCenter, zoom);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    const goldIcon = L.divIcon({
      className: '',
      html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#E6A275,#D49B74);border-radius:50%;border:3px solid #FEF5E7;box-shadow:0 0 16px rgba(230, 162, 117, 0.5);display:flex;align-items:center;justify-content:center;font-size:12px;">📍</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14],
    });

    locations.forEach(loc => {
      if (!loc.lat || !loc.lng) return;
      const marker = L.marker([loc.lat, loc.lng], { icon: goldIcon }).addTo(map);
      marker.bindPopup(`
        <div style="padding:14px;font-family: inherit;min-width:220px;">
          <strong style="color:#D49B74;font-size:20px;display:block;margin-bottom:6px;">${loc.name || loc.locationName}</strong>
          <span style="color:#BFC0C1;font-size:16px;display:block;margin-bottom:14px;">📍 ${loc.province || ''}</span>
          ${loc.description ? `<p style="color:#666;font-size:17px;margin:0 0 14px;line-height:1.6;max-height:100px;overflow:hidden;">${loc.description.substring(0,80)}...</p>` : ''}
          <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}" target="_blank"
            style="display:inline-block;padding:10px 18px;background:rgba(230, 162, 117, 0.15);color:#E6A275;border-radius:10px;text-decoration:none;font-size:17px;font-weight:600;width:100%;text-align:center;box-sizing:border-box;border:1px solid rgba(230, 162, 117, 0.3);">
            📍 นำทางด้วย Google Maps
          </a>
        </div>
      `, { className: 'map-popup', maxWidth: 350 });
      if (onMarkerClick) marker.on('click', () => onMarkerClick(loc));
    });

    if (locations.length > 1) {
      const bounds = L.latLngBounds(locations.filter(l => l.lat && l.lng).map(l => [l.lat, l.lng]));
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
    }
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [locations, center, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ height, borderRadius: 16, border: '1px solid rgba(232,160,32,.15)' }}
    />
  );
};

/* ── Map Picker ── */
export const MapPicker = ({ lat, lng, onPick, height = 280 }) => {
  const pickerMapRef = useRef(null);
  const pickerMapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const extractProvince = (addr) => {
    if (!addr) return '';
    const p = addr.province || addr.state || addr.city || addr.town || addr.village;
    return p ? p.replace('จังหวัด', '').replace('Province', '').trim() : '';
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await res.json();
      if (data?.address) return extractProvince(data.address);
    } catch (err) { console.error('Reverse Geocode failed:', err); }
    return '';
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!search || !pickerMapInstance.current) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=5`);
      const data = await res.json();
      setResults(data || []);
      if (!data?.length) alert('ไม่พบสถานที่นี้ ลองระบุชื่อให้ชัดเจนขึ้นครับ');
    } catch (err) { console.error('Search failed:', err); }
    finally { setSearching(false); }
  };

  const selectPlace = (place) => {
    if (!pickerMapInstance.current) return;
    const newLat = parseFloat(place.lat);
    const newLng = parseFloat(place.lon);
    const province = extractProvince(place.address);
    pickerMapInstance.current.setView([newLat, newLng], 15);
    const L = window.L;
    const goldIcon = L.divIcon({
      className: '',
      html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#E6A275,#D49B74);border-radius:50%;border:4px solid #fff;box-shadow:0 0 20px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;font-size:14px;">⭐️</div>`,
      iconSize: [28, 28], iconAnchor: [14, 28],
    });
    if (markerInstance.current) { markerInstance.current.setLatLng([newLat, newLng]); }
    else { markerInstance.current = L.marker([newLat, newLng], { icon: goldIcon }).addTo(pickerMapInstance.current); }
    onPick(newLat, newLng, province);
    setResults([]);
    setSearch(place.display_name.split(',')[0]);
  };

  useEffect(() => {
    if (!pickerMapRef.current || !window.L || pickerMapInstance.current) return;
    const L = window.L;
    const initialPos = (lat && lng) ? [lat, lng] : [13.7563, 100.5018];
    const map = L.map(pickerMapRef.current, { zoomControl: false, attributionControl: false }).setView(initialPos, 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const goldIcon = L.divIcon({
      className: '',
      html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#E8A020,#C47010);border-radius:50%;border:4px solid #fff;box-shadow:0 0 20px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;font-size:14px;">⭐️</div>`,
      iconSize: [28, 28], iconAnchor: [14, 28],
    });
    if (lat && lng) { markerInstance.current = L.marker([lat, lng], { icon: goldIcon }).addTo(map); }
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (markerInstance.current) { markerInstance.current.setLatLng(e.latlng); }
      else { markerInstance.current = L.marker(e.latlng, { icon: goldIcon }).addTo(map); }
      const province = await reverseGeocode(lat, lng);
      onPick(lat, lng, province);
      setResults([]);
    });
    pickerMapInstance.current = map;
    return () => { map.remove(); pickerMapInstance.current = null; };
  }, []);

  return (
    <div className="mb-4">
      <Label>ค้นหาและปักหมุดสถานที่:</Label>
      <div className="relative mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="เช่น KMITL, Central World..."
            className="inp flex-1"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="btn-gold px-4 rounded-[10px] shrink-0 text-[13px]"
          >
            {searching ? 'รอ...' : 'ค้นหา'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 z-[1000] shadow-[0_10px_30px_rgba(0,0,0,.1)] overflow-hidden">
            {results.map((r, i) => (
              <div
                key={i}
                onClick={() => selectPlace(r)}
                className={`px-4 py-3 cursor-pointer hover:bg-[rgba(230,162,117,0.08)] transition-colors ${i < results.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="text-[18px] font-semibold text-[#4A4A4A] mb-0.5">{r.display_name.split(',')[0]}</div>
                <div className="text-[15px] text-[#BFC0C1] truncate">{r.display_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={pickerMapRef} style={{ height, borderRadius: 12, border: '1px solid rgba(255,255,255,.1)', marginBottom: 8, cursor: 'crosshair' }} />
      <div className="text-[11px] text-[var(--color-gold)] text-center opacity-80">
        👆 เลือกผลการค้นหา หรือคลิกบนแผนที่เพื่อระบุจังหวัดอัตโนมัติ
      </div>
    </div>
  );
};

/* ── Scroll to top ── */
export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className={`scroll-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >↑</button>
  );
};

/* ── Toast ── */
export const ToastMsg = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'error' ? 'rgba(200,50,50,.92)' : 'rgba(20,160,90,.92)';
  const Icon = type === 'error' ? XCircle : CheckCircle2;
  return (
    <div className="toast animate-fadeUp" style={{ background: bg, color: '#fff' }}>
      <Icon size={18} /> {msg}
    </div>
  );
};

/* ── Modal ── */
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-[20px] text-[var(--color-text)]">{title}</h3>
          <button
            onClick={onClose}
            className="btn-ghost rounded-lg w-8 h-8 text-base flex items-center justify-center"
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ── Stars ── */
export const Stars = ({ val = 0, onChange, size = 20, readonly = false }) => {
  const [hov, setHov] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={readonly ? '' : 'star'}
          style={{
            fontSize: size,
            color: (hov || val) >= i ? '#E6A275' : '#D1D5DB',
            lineHeight: 1
          }}
          onMouseEnter={() => !readonly && setHov(i)}
          onMouseLeave={() => !readonly && setHov(0)}
          onClick={() => !readonly && onChange?.(i)}
        >★</span>
      ))}
    </div>
  );
};

/* ── Label ── */
export const Label = ({ children }) => (
  <label className="block text-[16px] font-semibold text-[var(--color-muted)] uppercase tracking-[.05em] mb-2">
    {children}
  </label>
);

/* ── Field ── */
export const Field = ({ label, children }) => (
  <div className="mb-4">
    {label && <Label>{label}</Label>}
    {children}
  </div>
);
