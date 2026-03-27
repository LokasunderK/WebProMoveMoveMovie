import React, { useState } from 'react';
import { Megaphone, Plus, Edit2, Trash2, Eye, EyeOff, MapPin } from 'lucide-react';
import { Modal, Field, MapPicker } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { AdController } from '../services/db';

const PartnerPage = () => {
  const { user, toast } = useAppContext();
  const [updater, setUpdater] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({});

  if (!user || user.role !== 'partner') {
    return <div className="text-center py-[120px] px-6"><h3 className="text-[20px]">ไม่มีสิทธิ์เข้าถึงหน้านี้ เฉพาะ Partner เท่านั้น</h3></div>;
  }

  const refresh = () => setUpdater(x => x + 1);

  const myAds = AdController.list().filter(a => a.partnerId === user.id);

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData(ad);
    setModalOpen(true);
  };
  
  const handleCreate = () => {
    setEditingAd(null);
    setFormData({});
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('ยืนยันลบโฆษณานี้?')) {
      AdController.delete(id);
      toast('ลบโฆษณาเรียบร้อย');
      refresh();
    }
  };

  const handleToggleVis = (id) => {
    AdController.toggleVisibility(id);
    toast('เปลี่ยนสถานะโฆษณาเรียบร้อย');
    refresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAd) {
        await AdController.update(editingAd.id, formData);
      } else {
        await AdController.add({ ...formData, partnerId: user.id });
      }
      toast('บันทึกโฆษณาสำเร็จ (สถานะตั้งต้น: รอตรวจสอบหรือซ่อน)');
      setModalOpen(false);
      refresh();
    } catch(err) {
      toast(err.message || 'บันทึกโฆษณาไม่สำเร็จ', 'error');
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto pt-[100px] pb-16 px-6">
      <div className="animate-fade-up">
        
        <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
          <h1 className="font-serif text-[32px] m-0 flex items-center gap-3">
            <Megaphone size={32} className="text-gold" /> เสนอโฆษณา <span className="gold-text">(Partner)</span>
          </h1>
          <button onClick={handleCreate} className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl">
            <Plus size={16} /> สร้างแคมเปญใหม่
          </button>
        </div>

        {myAds.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {myAds.map(a => (
              <div key={a.id} className={`bg-card rounded-2xl p-6 border transition-colors ${a.hidden ? 'border-red-500/20' : 'border-green-400/20'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${a.hidden ? 'badge-red' : 'badge-green'}`}>
                    {a.hidden ? 'ระงับ/รออนุมัติ' : 'เผยแพร่แล้ว'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleVis(a.id)} className="btn-ghost p-1.5 rounded-md" title={a.hidden ? 'ขอเผยแพร่' : 'ร้องขอซ่อน'}>
                      {a.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => handleEdit(a)} className="btn-ghost p-1.5 rounded-md"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(a.id)} className="btn-danger p-1.5 rounded-md"><Trash2 size={14} /></button>
                  </div>
                </div>
                
                <h3 className="font-serif text-[18px] mb-2 text-main">{a.title}</h3>
                <p className="text-muted text-[14px] leading-[1.6] mb-4 overflow-hidden display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical">{a.description}</p>
                <div className="text-[12px] text-white/20 flex items-center gap-1.5"><MapPin size={12}/> พิกัด: {a.lat || '-'}, {a.lng || '-'}</div>
                <div className="text-[12px] text-white/20 mt-1">เพิ่มเมื่อ: {new Date(a.createdAt).toLocaleDateString('th-TH')}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-[60px] px-6 bg-card rounded-2xl border border-dashed border-white/10">
            <Megaphone size={40} className="text-muted mx-auto mb-4" />
            <div className="text-main text-[16px] mb-2">ยังไม่มีแคมเปญโฆษณา</div>
            <div className="text-muted text-[14px]">สร้างโฆษณาแรกของคุณเพื่อโปรโมทสถานที่ใกล้เคียงการถ่ายทำได้เลย</div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingAd ? 'แก้ไขโฆษณา' : 'สร้างโฆษณาใหม่'}>
        <form onSubmit={handleSubmit}>
          <Field label="หัวข้อแคมเปญ">
            <input required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="inp" placeholder="โปรโมชั่นโรงแรมใกล้ชิดธรรมชาติ..." />
          </Field>
          <Field label="รายละเอียด">
            <textarea required value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="inp min-h-[80px]" placeholder="รับส่วนลด 20% เมื่อโชว์หน้าแอป..." />
          </Field>

          <MapPicker 
            lat={formData.lat} 
            lng={formData.lng} 
            onPick={(lat, lng) => setFormData({ ...formData, lat, lng })} 
          />

          <div className="flex gap-4 mt-4 max-md:flex-col">
             <Field label="ละติจูดเป้าหมาย"><input type="number" step="0.0001" value={formData.lat || ''} onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="inp" /></Field>
             <Field label="ลองจิจูดเป้าหมาย"><input type="number" step="0.0001" value={formData.lng || ''} onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="inp" /></Field>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1 py-3 rounded-xl block text-center">ยกเลิก</button>
            <button type="submit" className="btn-gold flex-1 py-3 rounded-xl block text-center">บันทึกข้อมูล</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PartnerPage;
