import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { ScrollToTop, ToastMsg, ConfirmDialog } from './UI';
import { useAppContext } from '../context/AppContext';

const Layout = ({ children }) => {
  const { toastData, setToastData, confirmData, setConfirmData } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="animate-page-enter min-h-[80vh]">
        {children}
      </main>
      
      <footer className="bg-[#0A0A14] border-t border-white/5 px-6 pt-11 pb-9 text-center mt-auto">
        <div className="font-serif text-[22px] mb-2.5">
          Move<span className="gold-text">³</span>Movie
        </div>
        <p className="text-muted text-[13px] m-0 mb-2">
          ระบบแนะนำสถานที่ถ่ายทำ ตามรอยภาพยนตร์ไทย
        </p>
        <div className="w-20 h-px bg-gold/20 mx-auto my-4" />
        <p className="text-[#3A3A4A] text-[11px] m-0">
          KMITL · Software Analysis &amp; Design · 05506113 · ปีการศึกษา 2/2568
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

      <ConfirmDialog
        data={confirmData}
        onConfirm={() => confirmData?.onConfirm?.()}
        onCancel={() => setConfirmData(null)}
      />
    </>
  );
};

export default Layout;
