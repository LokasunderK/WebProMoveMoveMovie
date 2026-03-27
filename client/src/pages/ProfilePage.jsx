import React from 'react';
import { User, Gift, Clock, Star } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PointController } from '../services/db';

const ProfilePage = () => {
  const { user } = useAppContext();
  const pts = PointController.get(user?.id);

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="max-w-[800px] mx-auto mt-[140px] mb-[100px] px-6">
      <div className="animate-fade-up">
        
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/10 max-md:flex-col max-md:text-center max-md:gap-4 max-md:pb-6">
          <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-gold to-gold-dim text-[#07070F] flex items-center justify-center text-[40px] font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5 max-md:justify-center">
              <h1 className="font-serif text-[32px] m-0">{user.name}</h1>
              <span className="badge badge-gray">{user.role}</span>
            </div>
            <div className="text-muted text-[16px] flex items-center gap-1.5 mb-3 max-md:justify-center">
              <User size={16} /> {user.email}
            </div>
            <div className="bg-gold/10 border border-gold/20 rounded-[20px] px-4 py-1 inline-flex items-center gap-2 text-gold font-semibold max-md:mx-auto">
              <Star size={16} className="fill-gold" /> แต้มสะสม: {pts} แต้ม
            </div>
          </div>
        </div>

        <h2 className="font-serif text-[24px] mb-5 flex items-center gap-2 max-md:justify-center">
          <Clock size={24} className="text-gold" /> กิจกรรมล่าสุด
        </h2>
        <div className="bg-card border border-white/5 rounded-2xl p-8 text-center">
          <Gift size={48} className="text-white/10 mx-auto mb-4" />
          <div className="text-[16px] text-muted mb-1">ยังไม่มีประวัติการแลกของรางวัล หรือเขียนรีวิว</div>
          <div className="text-[14px] text-white/20">สะสมแต้มจากการแชร์ประสบการณ์ แล้วนำมาแลกรางวัลได้เลย!</div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;
