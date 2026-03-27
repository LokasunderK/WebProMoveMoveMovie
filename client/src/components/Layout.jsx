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
      
      <footer style={{ background: '#FAF3E0', borderTop: '1px solid rgba(212, 155, 116, 0.1)', padding: '60px 24px 44px', textAlign: 'center', marginTop: 'auto' }}>
        <div className="font-serif" style={{ fontSize: 28, marginBottom: 12, fontWeight: 900, color: '#4A4A4A' }}>
          Movie²Movies
        </div>
        <p style={{ color: '#4A4A4A', fontSize: 16, margin: '0 0 10px', fontWeight: 500 }}>
          ระบบแนะนำสถานที่ถ่ายทำ ตามรอยภาพยนตร์ไทย
        </p>
        <div style={{ width: 100, height: 1.5, background: 'rgba(230, 162, 117, 0.25)', margin: '20px auto' }} />
        <p style={{ color: '#4A4A4A', fontSize: 13, margin: 0, letterSpacing: '0.05em' }}>
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
