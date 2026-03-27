import React, { useState } from 'react';
import { Gift, Star, Clock, Ticket } from 'lucide-react';
import { Modal } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { RewardController, PointController } from '../services/db';

const RewardsPage = () => {
  const { user, toast } = useAppContext();
  const rawRewards = RewardController.list();
  const rewards = rawRewards.filter(r => !r.hidden);
  
  const [targetReward, setTargetReward] = useState(null);

  const handleRedeem = () => {
    if (!targetReward) return;
    try {
      PointController.spend(user.id, targetReward.points);
      
      // Update stock
      RewardController.update(targetReward.id, { stock: targetReward.stock - 1 });
      
      toast(`แลกรับ ${targetReward.title} สำเร็จ!`);
      setTargetReward(null);
    } catch (err) {
      toast(err.message || 'แต้มสะสมไม่พอ', 'error');
      setTargetReward(null);
    }
  };

  const pts = user ? PointController.get(user.id) : 0;

  if (!user) {
    return (
      <div className="text-center py-[120px] px-6 text-muted">
        <Ticket size={48} className="mx-auto mb-4" />
        <h2 className="font-serif text-[24px]">กรุณาเข้าสู่ระบบเพื่อดูและแลกของรางวัล</h2>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pt-[100px] pb-16 px-6">
      <div className="animate-fade-up">

        <div className="bg-card border border-gold/10 rounded-3xl p-10 mb-[60px] flex justify-between items-center max-md:flex-col max-md:text-center max-md:gap-8 max-md:p-6">
          <div>
            <h1 className="font-serif text-[clamp(28px,4vw,42px)] m-0 mb-3 flex items-center gap-3 max-md:justify-center">
              <Gift size={36} className="text-gold" /> 
              แลกของรางวัลสุด<span className="gold-text">พิเศษ</span>
            </h1>
            <p className="text-muted text-[16px]">สะสมแต้มจากการแชร์ประสบการณ์การไปตามรอยภาพยนตร์</p>
          </div>
          <div className="bg-gold/5 px-10 py-5 rounded-[20px] text-center border border-gold/20 shrink-0">
            <div className="text-muted text-[13px] mb-2 uppercase tracking-wide">แต้มสะสมปัจจุบัน</div>
            <div className="text-gold text-[48px] font-bold leading-none drop-shadow-[0_0_20px_rgba(232,160,32,0.3)]">
              {pts} <span className="text-[18px] text-main font-normal">pts</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {rewards.map(r => (
            <div key={r.id} className="card-hover delay-200 bg-card border border-white/5 rounded-2xl overflow-hidden">
              <div className="h-[180px] relative">
                <img src={r.img || `https://picsum.photos/400/300?reward=${r.id}`} alt={r.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-[rgba(7,7,15,0.8)] backdrop-blur-md px-3.5 py-1.5 rounded-full text-[13px] font-bold text-gold flex items-center gap-1.5 border border-gold/30">
                  <Star fill="var(--color-gold)" size={14} /> {r.points} แต้ม
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-[18px] mb-2">{r.title}</h3>
                <div className="text-muted text-[13px] flex justify-between items-center mb-5">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {r.stock > 0 ? `เหลือ ${r.stock} สิทธิ์` : 'หมดแล้ว'}</span>
                </div>
                {r.stock > 0 ? (
                  <button onClick={() => setTargetReward(r)} className="btn-gold w-full py-3 rounded-xl text-[14px]">
                    แลกรับสิทธิ์
                  </button>
                ) : (
                  <button className="btn-ghost w-full py-3 rounded-xl text-[14px] cursor-not-allowed opacity-50" disabled>
                    สิทธิ์เต็มแล้ว
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!targetReward} onClose={() => setTargetReward(null)} title="ยืนยันการแลกรางวัล">
        {targetReward && (
          <div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 text-gold">
                <Gift size={32} />
              </div>
              <h4 className="font-serif text-[22px] m-0 mb-2">{targetReward.title}</h4>
              <p className="text-muted m-0">ใช้ {targetReward.points} แต้ม จาก {pts} แต้มของคุณ</p>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button onClick={() => setTargetReward(null)} className="btn-ghost flex-1 py-3 rounded-xl">ยกเลิก</button>
              <button 
                onClick={handleRedeem} 
                disabled={pts < targetReward.points}
                className={`flex-1 py-3 rounded-xl transition-all ${pts >= targetReward.points ? 'btn-gold' : 'bg-white/5 text-muted cursor-not-allowed'}`}>
                {pts >= targetReward.points ? 'ยืนยันการแลก' : 'แต้มไม่พอ'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RewardsPage;
