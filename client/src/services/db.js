// services/db.js - LocalStorage based Mock Database

const defaultData = {
  users: [
    { id: 1, email: 'admin@mmm.com', password: 'admin', role: 'admin', name: 'Admin', createdAt: '2024-01-01' },
    { id: 2, email: 'user@mmm.com', password: 'user', role: 'member', name: 'Member A', createdAt: '2024-01-02' },
    { id: 3, email: 'partner@mmm.com', password: 'partner', role: 'partner', name: 'Partner One', createdAt: '2024-01-03' }
  ],
  movies: [
    { id: 1, title: 'พี่มาก..พระโขนง', poster: 'https://picsum.photos/500/750?movie=1', description: 'ภาพยนตร์สยองขวัญสุดฮิต...', releaseYear: 2013, genre: 'Horror', createdAt: '2024-01-01' },
    { id: 2, title: 'ฉลาดเกมส์โกง', poster: 'https://picsum.photos/500/750?movie=2', description: 'เรื่องราวของนักเรียนหญิงฉลาด...', releaseYear: 2017, genre: 'Thriller', createdAt: '2024-01-02' }
  ],
  locations: [
    { id: 1, name: 'วัดมหาบุศย์ พระโขนง', lat: 13.7063, lng: 100.6018, province: 'Bangkok', description: 'วัดเก่าแก่ริมคลอง... ถ่ายทำพี่มาก', type: 'Temple', createdAt: '2024-01-01', hidden: false }
  ],
  scenes: [
    { id: 1, movieId: 1, locationId: 1, description: 'ฉากที่มากและเพื่อนมาเยี่ยมนาค', imgUrl: 'https://picsum.photos/400/250?1' }
  ],
  reviews: [
    { id: 1, userId: 2, locationId: 1, rating: 5, comment: 'สวยงาม บรรยากาศสมจริง', createdAt: '2024-02-01' }
  ],
  rewards: [
    { id: 1, title: 'ตั๋วหนังฟรี 1 ที่นั่ง', points: 500, stock: 10, img: 'https://picsum.photos/300/200?ticket', hidden: false }
  ],
  ads: [
    { id: 1, partnerId: 3, title: 'โปรพักโรงแรมใกล้ที่ถ่ายทำ', description: 'ส่วนลด 20% สำหรับแฟนคลับ', lat: 13.7063, lng: 100.6018, hidden: false, createdAt: '2024-02-10' }
  ],
  points: { 2: 600, 3: 100 },
  redemptions: [],
  _mid: 3, _lid: 2, _rid: 2, _adid: 2, _uid: 4
};

const DB_KEY = 'movemovie_v3_db';

const getDB = () => {
  const d = localStorage.getItem(DB_KEY);
  return d ? JSON.parse(d) : defaultData;
};

const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const AuthController = {
  login(email, pass) {
    const db = getDB();
    return db.users.find(u => u.email === email && u.password === pass) || null;
  },
  register(email, pass, name) {
    const db = getDB();
    if (db.users.find(u => u.email === email)) throw new Error('Email already exists');
    const u = { id: db._uid++, email, password: pass, name, role: 'member', createdAt: new Date().toISOString() };
    db.users.push(u);
    db.points[u.id] = 100; // Welcome points
    saveDB(db);
    return u;
  }
};

export const MovieController = {
  list() { return getDB().movies; },
  get(id) { return getDB().movies.find(m => m.id === parseInt(id)); },
  scenes(movieId) { return getDB().scenes.filter(s => s.movieId === parseInt(movieId)); },
  add(data) {
    const db = getDB();
    const m = { id: db._mid++, ...data, createdAt: new Date().toISOString() };
    db.movies.push(m);
    saveDB(db);
    return m;
  },
  update(id, data) {
    const db = getDB();
    const idx = db.movies.findIndex(m => m.id === parseInt(id));
    if (idx !== -1) { db.movies[idx] = { ...db.movies[idx], ...data }; saveDB(db); }
  },
  delete(id) {
    const db = getDB();
    db.movies = db.movies.filter(m => m.id !== parseInt(id));
    db.scenes = db.scenes.filter(s => s.movieId !== parseInt(id));
    saveDB(db);
  }
};

export const LocationController = {
  list() { return getDB().locations; },
  get(id) { return getDB().locations.find(l => l.id === parseInt(id)); },
  add(data) {
    const db = getDB();
    const l = { id: db._lid++, ...data, hidden: false, createdAt: new Date().toISOString() };
    db.locations.push(l);
    saveDB(db);
    return l;
  },
  update(id, data) {
    const db = getDB();
    const idx = db.locations.findIndex(l => l.id === parseInt(id));
    if (idx !== -1) { db.locations[idx] = { ...db.locations[idx], ...data }; saveDB(db); }
  },
  delete(id) {
    const db = getDB();
    db.locations = db.locations.filter(l => l.id !== parseInt(id));
    db.scenes = db.scenes.filter(s => s.locationId !== parseInt(id));
    saveDB(db);
  },
  toggleVisibility(id) {
    const db = getDB();
    const l = db.locations.find(x => x.id === parseInt(id));
    if (l) { l.hidden = !l.hidden; saveDB(db); }
  }
};

export const AdController = {
  list() { return getDB().ads; },
  add(data) {
    const db = getDB();
    const a = { id: db._adid++, ...data, hidden: false, createdAt: new Date().toISOString() };
    db.ads.push(a);
    saveDB(db);
    return a;
  },
  update(id, data) {
    const db = getDB();
    const idx = db.ads.findIndex(a => a.id === parseInt(id));
    if (idx !== -1) { db.ads[idx] = { ...db.ads[idx], ...data }; saveDB(db); }
  },
  delete(id) {
    const db = getDB();
    db.ads = db.ads.filter(a => a.id !== parseInt(id));
    saveDB(db);
  },
  toggleVisibility(id) {
    const db = getDB();
    const a = db.ads.find(x => x.id === parseInt(id));
    if (a) { a.hidden = !a.hidden; saveDB(db); }
  }
};

export const RewardController = {
  list() { return getDB().rewards; },
  add(data) {
    const db = getDB();
    const r = { id: db._rid++, ...data, hidden: false };
    db.rewards.push(r);
    saveDB(db);
  },
  update(id, data) {
    const db = getDB();
    const idx = db.rewards.findIndex(r => r.id === parseInt(id));
    if (idx !== -1) { db.rewards[idx] = { ...db.rewards[idx], ...data }; saveDB(db); }
  },
  delete(id) {
    const db = getDB();
    db.rewards = db.rewards.filter(r => r.id !== parseInt(id));
    saveDB(db);
  },
  toggleVisibility(id) {
    const db = getDB();
    const r = db.rewards.find(x => x.id === parseInt(id));
    if (r) { r.hidden = !r.hidden; saveDB(db); }
  }
};

export const PointController = {
  get(userId) { return getDB().points[userId] || 0; },
  add(userId, amount) {
    const db = getDB();
    db.points[userId] = (db.points[userId] || 0) + amount;
    saveDB(db);
  },
  spend(userId, amount) {
    const db = getDB();
    if ((db.points[userId] || 0) < amount) throw new Error('Not enough points');
    db.points[userId] -= amount;
    saveDB(db);
  }
};

export const ReviewController = {
  list(locationId) { return getDB().reviews.filter(r => r.locationId === parseInt(locationId)); },
  add(data) {
    const db = getDB();
    const r = { id: Date.now(), ...data, createdAt: new Date().toISOString() };
    db.reviews.push(r);
    saveDB(db);
    return r;
  },
  delete(id) {
    const db = getDB();
    db.reviews = db.reviews.filter(r => r.id !== parseInt(id));
    saveDB(db);
  }
};

export const UserDB = {
  list() { return getDB().users; }
};
