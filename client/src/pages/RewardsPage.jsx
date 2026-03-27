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
      <div style={{ textAlign: 'center', padding: '120px 24px', color: '#7A7990' }}>
        <Ticket size={48} style={{ margin: '0 auto 16px' }} />
        <h2 className="font-serif">กรุณาเข้าสู่ระบบเพื่อดูและแลกของรางวัล</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 24px 80px' }}>
      <div className="animate-fadeUp">
        
        {/* Banner */}
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)',
          borderRadius: 24, padding: '40px', marginBottom: 60,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24,
          boxShadow: '0 12px 48px rgba(212, 155, 116, 0.08)'
        }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 42px)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 12, color: '#D49B74', fontWeight: 900 }}>
              <Gift size={42} color="#D49B74" /> 
              แลกของรางวัลสุด<span className="gold-text">พิเศษ</span>
            </h1>
            <p style={{ color: '#BFC0C1', fontSize: 20, margin: 0, fontWeight: 500 }}>สะสมแต้มจากการแชร์ประสบการณ์การไปตามรอยภาพยนตร์</p>
          </div>
          <div style={{
            background: '#FAF3E0', padding: '24px 44px', borderRadius: 20,
            textAlign: 'center', border: '1px solid rgba(230, 162, 117, 0.2)'
          }}>
            <div style={{ color: '#D49B74', fontSize: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>แต้มสะสมปัจจุบัน</div>
             <div style={{ color: '#E6A275', fontSize: 52, fontWeight: 900, lineHeight: 1 }}>
              {pts} <span style={{ fontSize: 20, color: '#BFC0C1' }}>pts</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {rewards.map(r => (
            <div key={r.id} className="card-hover d2" style={{ background: '#FFFFFF', border: '1px solid rgba(212, 155, 116, 0.15)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 180, position: 'relative' }}>
                <img src={r.img || `https://picsum.photos/400/300?reward=${r.id}`} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)',
                  padding: '6px 14px', borderRadius: 20, fontSize: 15, fontWeight: 800, color: '#E6A275',
                  display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(230, 162, 117, 0.3)'
                }}>
                  <Star fill="#E6A275" size={16} /> {r.points} แต้ม
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 className="font-serif" style={{ fontSize: 22, marginBottom: 8, color: '#4A4A4A', fontWeight: 800 }}>{r.title}</h3>
                <div style={{ color: '#BFC0C1', fontSize: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> {r.stock > 0 ? `เหลือ ${r.stock} สิทธิ์` : 'หมดแล้ว'}</span>
                </div>
                {r.stock > 0 ? (
                  <button onClick={() => setTargetReward(r)} className="btn-gold" style={{ width: '100%', padding: '12px 0', borderRadius: 10 }}>
                    แลกรับสิทธิ์
                  </button>
                ) : (
                  <button className="btn-ghost" disabled style={{ width: '100%', padding: '12px 0', borderRadius: 10, cursor: 'not-allowed', opacity: .5 }}>
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
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(232,160,32,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#E8A020' }}>
                <Gift size={32} />
              </div>
              <h4 className="font-serif" style={{ fontSize: 22, margin: '0 0 8px' }}>{targetReward.title}</h4>
              <p style={{ color: '#7A7990', margin: 0 }}>ใช้ {targetReward.points} แต้ม จาก {pts} แต้มของคุณ</p>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setTargetReward(null)} className="btn-ghost" style={{ flex: 1, padding: '12px 0', borderRadius: 10 }}>ยกเลิก</button>
              <button 
                onClick={handleRedeem} 
                disabled={pts < targetReward.points}
                className={pts >= targetReward.points ? 'btn-gold' : 'btn-ghost'} 
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, opacity: pts < targetReward.points ? .5 : 1, cursor: pts < targetReward.points ? 'not-allowed' : 'pointer' }}>
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
