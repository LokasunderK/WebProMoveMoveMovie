import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ─── interceptor แสดง error ใน console ─────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

// ─── Movies ─────────────────────────────────────────────────
export const movieAPI = {
  search:     (q)      => api.get(`/movies/search?q=${encodeURIComponent(q)}`),
  getPopular: ()       => api.get('/movies/popular'),
  getById:    (tmdbId) => api.get(`/movies/${tmdbId}`),
}

// ─── Locations ───────────────────────────────────────────────
export const locationAPI = {
  getAll:     ()        => api.get('/locations'),
  getById:    (id)      => api.get(`/locations/${id}`),
  getByMovie: (tmdbId)  => api.get(`/locations/movie/${tmdbId}`),
  create:     (data)    => api.post('/locations', data),
  update:     (id, data)=> api.put(`/locations/${id}`, data),
  delete:     (id)      => api.delete(`/locations/${id}`),
}

// ─── Reviews ────────────────────────────────────────────────
export const reviewAPI = {
  getByLocation: (locationId) => api.get(`/reviews/location/${locationId}`),
  create:        (data)       => api.post('/reviews', data),
  delete:        (id)         => api.delete(`/reviews/${id}`),
}