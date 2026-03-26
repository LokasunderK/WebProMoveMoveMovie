import React from 'react';
import Navbar from './Navbar';
import { ScrollToTop, ToastMsg } from './UI';
import { useAppContext } from '../context/AppContext';

const Layout = ({ children }) => {
  const { toastData, setToastData } = useAppContext();

  return (
    <>
      <Navbar />
      <main className="animate-pageEnter" style={{ minHeight: '80vh' }}>
        {children}
      </main>
      
      <footer style={{ background: '#0A0A14', borderTop: '1px solid rgba(255,255,255,.05)', padding: '46px 24px 36px', textAlign: 'center', marginTop: 'auto' }}>
        <div className="font-serif" style={{ fontSize: 22, marginBottom: 10 }}>
          Move<span className="gold-text">³</span>Movie
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 8px' }}>
          ระบบแนะนำสถานที่ถ่ายทำ ตามรอยภาพยนตร์ไทย
        </p>
        <div style={{ width: 80, height: 1, background: 'rgba(232,160,32,.2)', margin: '16px auto' }} />
        <p style={{ color: '#3A3A4A', fontSize: 11, margin: 0 }}>
          KMITL · Software Analysis & Design · 05506113 · ปีการศึกษา 2/2568
        </p>
      </footer>
      
      <ScrollToTop />
      {toastData && (
        <ToastMsg 
          key={toastData.key} 
          msg={toastData.msg} 
          type={toastData.type} 
          onClose={() => setToastData(null)} 
        />
      )}
    </>
  );
};

export default Layout;
