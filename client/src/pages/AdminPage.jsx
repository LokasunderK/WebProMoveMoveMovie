import React, { useState } from 'react';
import { Eye, EyeOff, Trash2, Edit2, Plus, Users, Film, MapPin, LayoutDashboard, Megaphone } from 'lucide-react';
import { Modal, Field, MapPicker } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { UserDB, MovieController, LocationController, AdController } from '../services/db';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
  const { user, toast } = useAppContext();
  const [tab, setTab] = useState('movies');
  const [updater, setUpdater] = useState(0);

  const [modalType, setModalType] = useState(null); // 'movies' | 'locations'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  if (!user || user.role !== 'admin') return <Navigate to="/auth" />;

  const refresh = () => setUpdater(x => x + 1);

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData(item);
    setModalType(type);
  };

  const handleCreate = (type) => {
    setEditingItem(null);
    setFormData({});
    setModalType(type);
  };

  const handleDelete = (id, controller, typeName) => {
    if (confirm(`ยืนยันการลบ${typeName}?`)) {
      controller.delete(id);
      toast(`ลบ${typeName}เรียบร้อย`);
      refresh();
    }
  };

  const handleToggleVis = (id, controller) => {
    controller.toggleVisibility(id);
    toast('เปลี่ยนสถานะการมองเห็นแล้ว');
    refresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'movies') {
        if (editingItem) await MovieController.update(editingItem.id, formData);
        else await MovieController.add(formData);
      } else if (modalType === 'locations') {
        if (editingItem) await LocationController.update(editingItem.id, formData);
        else await LocationController.add(formData);
      }
      toast('บันทึกข้อมูลสำเร็จ');
      setModalType(null);
      refresh();
    } catch(err) {
      toast(err.message || 'บันทึกข้อมูลไม่สำเร็จ', 'error');
    }
  };

  const movies = MovieController.list();
  const locations = LocationController.list();
  const ads = AdController.list();
  const users = UserDB.list();

  const tabDefs = [
    { id: 'movies', l: 'ภาพยนตร์', icon: Film },
    { id: 'locations', l: 'สถานที่', icon: MapPin },
    { id: 'ads', l: 'โฆษณา/โปรโมชั่น', icon: Megaphone },
    { id: 'users', l: 'ผู้ใช้งาน', icon: Users },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '110px 24px 80px' }}>
      <div className="animate-fadeUp">
        
        <h1 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 42px)', margin: '0 0 32px', display: 'flex', alignItems: 'center', gap: 12, color: '#D49B74' }}>
          <LayoutDashboard size={42} color="#D49B74" /> จัดการระบบ <span className="gold-text">(Admin)</span>
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(212, 155, 116, 0.12)', paddingBottom: 20, marginBottom: 32, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {tabDefs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`tab-item ${tab === t.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 15 }}
            >
              <t.icon size={16} /> {t.l}
            </button>
          ))}
        </div>

        {/* Movies */}
        {tab === 'movies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button onClick={() => handleCreate('movies')} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, fontSize: 16 }}>
                <Plus size={18} /> เพิ่มภาพยนตร์
              </button>
            </div>
            <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(212, 155, 116, 0.15)', boxShadow: '0 8px 32px rgba(212, 155, 116, 0.08)' }}>
              <table style={{ minWidth: 600 }}>
                <thead><tr><th>ID</th><th>ชื่อเรื่อง</th><th>ปีที่ฉาย</th><th>หมวดหมู่</th><th>จัดการ</th></tr></thead>
                <tbody>
                  {movies.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td><td>{m.title}</td><td>{m.releaseYear}</td><td>{m.genre}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleEdit(m, 'movies')} className="btn-ghost" style={{ padding: '6px', borderRadius: 6 }}><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(m.id, MovieController, 'ภาพยนตร์')} className="btn-danger" style={{ padding: '6px', borderRadius: 6 }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Locations */}
        {tab === 'locations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button onClick={() => handleCreate('locations')} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, fontSize: 16 }}>
                <Plus size={18} /> เพิ่มสถานที่
              </button>
            </div>
            <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(212, 155, 116, 0.15)', boxShadow: '0 8px 32px rgba(212, 155, 116, 0.08)' }}>
              <table style={{ minWidth: 600 }}>
                <thead><tr><th>ID</th><th>ชื่อสถานที่</th><th>จังหวัด</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
                <tbody>
                  {locations.map(l => (
                    <tr key={l.id}>
                      <td>{l.id}</td><td>{l.name}</td><td>{l.province}</td>
                      <td>
                        {l.hidden ? <span style={{ color: '#7A7990', display: 'flex', alignItems: 'center', gap: 6 }}><EyeOff size={14} /> ซ่อน</span> : <span style={{ color: '#E8A020', display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} /> แสดง</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleToggleVis(l.id, LocationController)} className="btn-ghost" style={{ padding: '6px', borderRadius: 6 }}>
                            {l.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button onClick={() => handleEdit(l, 'locations')} className="btn-ghost" style={{ padding: '6px', borderRadius: 6 }}><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(l.id, LocationController, 'สถานที่')} className="btn-danger" style={{ padding: '6px', borderRadius: 6 }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ads */}
        {tab === 'ads' && (
          <div>
            <h3 className="font-serif" style={{ marginBottom: 20, fontSize: 24, color: '#D49B74' }}>อนุมัติแคมเปญ & โฆษณาจาก Partner</h3>
            <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(212, 155, 116, 0.15)', boxShadow: '0 8px 32px rgba(212, 155, 116, 0.08)' }}>
              <table style={{ minWidth: 600 }}>
                <thead><tr><th>ID</th><th>หัวข้อ</th><th>ชื่อ Partner</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
                <tbody>
                  {ads.map(a => {
                    const partner = users.find(u => u.id === a.partnerId);
                    return (
                      <tr key={a.id}>
                        <td>{a.id}</td><td>{a.title}</td>
                        <td>{partner ? partner.name : 'Unknown'}</td>
                        <td>
                          {a.hidden ? <span style={{ background: 'rgba(255,255,255,.05)', padding: '4px 8px', borderRadius: 12, fontSize: 12, color: '#7A7990' }}>รออนุมัติ / ซ่อน</span> : <span style={{ background: 'rgba(74,222,128,.1)', padding: '4px 8px', borderRadius: 12, fontSize: 12, color: '#4ADE80' }}>อนุมัติแล้ว / แสดง</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button onClick={() => handleToggleVis(a.id, AdController)} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 6, fontSize: 12 }}>
                              {a.hidden ? <Eye size={14} /> : <EyeOff size={14} />} {a.hidden ? 'อนุมัติ' : 'ระงับ'}
                            </button>
                            <button onClick={() => handleDelete(a.id, AdController, 'โฆษณา')} className="btn-danger" style={{ padding: '6px', borderRadius: 6 }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(212, 155, 116, 0.15)', boxShadow: '0 8px 32px rgba(212, 155, 116, 0.08)' }}>
             <table style={{ minWidth: 600 }}>
               <thead><tr><th>ID</th><th>ชื่อ</th><th>อีเมล</th><th>บทบาท</th><th>วันที่สมัคร</th></tr></thead>
               <tbody>
                 {users.map(u => (
                   <tr key={u.id}>
                     <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
                     <td><span className={`badge ${u.role === 'admin' ? 'badge-green' : u.role === 'partner' ? 'badge' : 'badge-gray'}`}>{u.role}</span></td>
                     <td>{new Date(u.createdAt).toLocaleDateString('th-TH')}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

      </div>

      <Modal open={!!modalType} onClose={() => setModalType(null)} title={editingItem ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}>
        <form onSubmit={handleSubmit}>
          {modalType === 'movies' && (
            <>
              <Field label="ชื่อภาพยนตร์"><input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="inp" /></Field>
              <Field label="ปีที่ฉาย"><input type="number" required value={formData.releaseYear || ''} onChange={e => setFormData({...formData, releaseYear: e.target.value})} className="inp" /></Field>
              <Field label="หมวดหมู่"><input required value={formData.genre || ''} onChange={e => setFormData({...formData, genre: e.target.value})} className="inp" /></Field>
              <Field label="URL โปสเตอร์"><input required value={formData.poster || ''} onChange={e => setFormData({...formData, poster: e.target.value})} className="inp" /></Field>
              <Field label="เรื่องย่อ"><textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="inp" /></Field>
            </>
          )}

          {modalType === 'locations' && (
            <>
              <Field label="ชื่อสถานที่"><input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="inp" /></Field>
              <Field label="จังหวัด"><input required value={formData.province || ''} onChange={e => setFormData({...formData, province: e.target.value})} className="inp" /></Field>
              <Field label="ประเภท"><input required value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} className="inp" placeholder="Temple, Beach, Cafe..." /></Field>
              
              <MapPicker 
                lat={formData.lat} 
                lng={formData.lng} 
                onPick={(lat, lng, province) => setFormData(prev => ({...prev, lat, lng, province: province || prev.province}))} 
              />
              
              <div style={{ display: 'flex', gap: 16 }}>
                <Field label="ละติจูด (Lat)"><input type="number" step="0.0001" required value={formData.lat || ''} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} className="inp" /></Field>
                <Field label="ลองจิจูด (Lng)"><input type="number" step="0.0001" required value={formData.lng || ''} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} className="inp" /></Field>
              </div>
              <Field label="รายละเอียด"><textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="inp" /></Field>
            </>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button type="button" onClick={() => setModalType(null)} className="btn-ghost" style={{ flex: 1, padding: '12px 0', borderRadius: 10 }}>ยกเลิก</button>
            <button type="submit" className="btn-gold" style={{ flex: 1, padding: '12px 0', borderRadius: 10 }}>บันทึกข้อมูล</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;
