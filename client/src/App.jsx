import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ExploreMapPage from './pages/ExploreMapPage';
import LocationPage from './pages/LocationPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import AdminPage from './pages/AdminPage';
import PartnerPage from './pages/PartnerPage';

import { initDB } from './services/db';
import { Shimmer } from './components/UI';

function App() {
  const [dbReady, setDbReady] = React.useState(false);

  React.useEffect(() => {
    initDB().then(() => setDbReady(true));
  }, []);

  if (!dbReady) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FEF5E7' }}>
        <h2 className="font-serif gold-text" style={{ fontSize: 32, marginBottom: 20 }}>Movie²Movies</h2>
        <Shimmer w={200} h={4} style={{ borderRadius: 4, background: '#E6A275' }} />
      </div>
    );
  }

  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/map" element={<ExploreMapPage />} />
          <Route path="/location/:id" element={<LocationPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/partner" element={<PartnerPage />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

export default App;