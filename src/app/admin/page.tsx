"use client";
import React, { useEffect, useState } from 'react';
import PortalNav from '../../components/PortalNav';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [payloadObj, setPayloadObj] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/data', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          window.location.href = '/portal';
          throw new Error('Not admin');
        }
        return res.json();
      })
      .then(data => {
        setUsers(data.users || []);
        setSubmissions(data.submissions || []);
        setLoading(false);
      })
      .catch(() => {});
  }, []);

  const openModal = (sub: any) => {
    setSelectedSub(sub);
    setPayloadObj(JSON.parse(sub.json_payload));
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const downloadJSON = () => {
    if(!selectedSub) return;
    const blob = new Blob([selectedSub.json_payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submission_${selectedSub.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAction = async (action: string, id: number, extraData: any = {}) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/${action}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(extraData)
      });
      if (res.ok) {
        alert("تمت العملية بنجاح.");
        window.location.reload();
      } else {
        alert("خطأ أثناء تنفيذ العملية.");
      }
    } catch(err) {
      console.error(err);
      alert("حدث خطأ.");
    }
  };

  const approve = (id: number) => {
    if(confirm("هل أنت متأكد من الموافقة؟ سيتم إنشاء Pull Request تلقائياً.")) handleAction('approve', id);
  };
  const reject = (id: number) => {
    const reason = prompt("يرجى إدخال سبب الرفض:");
    if(reason) handleAction('reject', id, { reason });
  };
  const block = (id: number) => {
    if(confirm("حظر هذا الطلب نهائياً؟")) handleAction('block', id);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;

  const filteredSubs = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

  return (
    <>
      <PortalNav />
      <div className="max-w-6xl mx-auto p-8 mt-6">
        <h1 className="text-3xl font-black mb-10 text-white">لوحة الإدارة</h1>
        
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-6 text-slate-200">جدول المستخدمين</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">البريد الإلكتروني</th>
                  <th className="p-4 font-semibold">الاسم</th>
                  <th className="p-4 font-semibold">مدير؟</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                    <td className="p-4">{u.id}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${u.is_admin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                            {u.is_admin ? 'نعم' : 'لا'}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-200">الطلبات المقدمة</h2>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 bg-slate-950 border border-slate-700 text-slate-300 rounded-lg outline-none">
              <option value="all">الكل</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">مقبول</option>
              <option value="rejected">مرفوض</option>
              <option value="blocked">محظور</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">اسم اللعبة</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {filteredSubs.map(sub => (
                  <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                    <td className="p-4">{sub.id}</td>
                    <td className="p-4 font-medium text-white">{sub.game_title}</td>
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${sub.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : ''}
                        ${sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : ''}
                        ${sub.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : ''}
                        ${sub.status === 'blocked' ? 'bg-slate-700/50 text-slate-400' : ''}
                        `}>
                        {sub.status === 'pending' && 'قيد المراجعة'}
                        {sub.status === 'approved' && 'مقبول'}
                        {sub.status === 'rejected' && 'مرفوض'}
                        {sub.status === 'blocked' && 'محظور'}
                        </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => openModal(sub)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-500 transition">عرض</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && selectedSub && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-2xl font-bold text-white">تفاصيل الطلب</h3>
              <button onClick={closeModal} className="text-slate-500 hover:text-rose-400 text-3xl transition">&times;</button>
            </div>
            
            <div className="mb-6 flex justify-end">
              <button onClick={downloadJSON} className="bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center gap-2">
                تحميل JSON
              </button>
            </div>
            
            <div className="mb-8 bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-x-auto">
              <pre className="text-sm text-indigo-300" dir="ltr">{JSON.stringify(payloadObj, null, 2)}</pre>
            </div>
            
            <div className="mb-8">
              <h4 className="font-semibold mb-4 text-slate-300">معاينة الواجهة (البطاقة الأولى)</h4>
              <div className="p-10 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/20 flex items-center justify-center min-h-[250px]">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center transform rotate-2 hover:rotate-0 transition duration-300">
                  <p className="text-2xl font-black text-slate-800 font-cairo">
                    {payloadObj?.cards?.length > 0 ? payloadObj.cards[0] : "لا يوجد بطاقات."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-slate-800">
              <button onClick={() => approve(selectedSub.id)} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition">موافقة</button>
              <button onClick={() => reject(selectedSub.id)} className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-500 transition">رفض</button>
              <button onClick={() => block(selectedSub.id)} className="px-6 bg-slate-800 text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition">حظر</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
