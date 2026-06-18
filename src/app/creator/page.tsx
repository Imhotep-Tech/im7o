"use client";
import React, { useEffect, useState } from 'react';
import PortalNav from '../../components/PortalNav';

export default function CreatorDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [hasPending, setHasPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gamesList, setGamesList] = useState<any[]>([]);

  // Form states
  const [isExtension, setIsExtension] = useState(false);
  const [targetGameId, setTargetGameId] = useState('');
  
  const [packName, setPackName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [engineTemplate, setEngineTemplate] = useState('hot-potato');
  const [mode, setMode] = useState('multi-team');
  const [themeColor, setThemeColor] = useState('#ef4444');
  const [logo, setLogo] = useState('bomb');
  const [hasTimer, setHasTimer] = useState(true);
  const [defaultTimerSeconds, setDefaultTimerSeconds] = useState(60);
  const [isTimerCustomizable, setIsTimerCustomizable] = useState(true);
  const [allowElimination, setAllowElimination] = useState(true);
  const [turnStrategy, setTurnStrategy] = useState('sequential');
  const [instructions, setInstructions] = useState('');
  const [cards, setCards] = useState<any[]>(['']);

  useEffect(() => {
    fetch('http://localhost:8000/api/creator/submissions', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          window.location.href = '/portal';
          throw new Error('Not auth');
        }
        return res.json();
      })
      .then(data => {
        setSubmissions(data.submissions || []);
        setHasPending(data.has_pending || false);
        setLoading(false);
        fetch('http://localhost:8000/api/auth/me', { credentials: 'include' })
          .then(r => r.json())
          .then(u => setAuthorName(u.name))
          .catch(() => {});
      })
      .catch(() => {});

    fetch('/api/games')
      .then(res => res.json())
      .then(data => setGamesList(data))
      .catch(() => {});
  }, []);

  const handleAddCard = () => {
    if (engineTemplate === 'mcq') setCards([...cards, { question: '', answer: '' }]);
    else if (engineTemplate === 'taboo') setCards([...cards, { word: '', forbidden: '' }]);
    else setCards([...cards, '']);
  };
  const handleRemoveCard = (idx: number) => {
    const newCards = cards.filter((_, i) => i !== idx);
    if (!newCards.length) {
      if (engineTemplate === 'mcq') setCards([{ question: '', answer: '' }]);
      else if (engineTemplate === 'taboo') setCards([{ word: '', forbidden: '' }]);
      else setCards(['']);
    } else {
      setCards(newCards);
    }
  };
  const handleCardChange = (idx: number, val: any) => {
    const newCards = [...cards];
    newCards[idx] = val;
    setCards(newCards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExtension && !targetGameId) {
      alert("يرجى اختيار اللعبة التي تريد إضافة البطاقات إليها");
      return;
    }

    const filteredCards = cards.filter((c: any) => {
      if (engineTemplate === 'mcq') return c?.question?.trim() && c?.answer?.trim();
      if (engineTemplate === 'taboo') return c?.word?.trim() && c?.forbidden?.trim();
      return typeof c === 'string' && c.trim() !== '';
    });
    
    const safeId = packName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'custom-game';

    const payload = isExtension ? filteredCards : {
      id: safeId,
      title: packName,
      author: authorName,
      engineTemplate,
      mode,
      themeColor,
      logo,
      hasTimer,
      defaultTimerSeconds: Number(defaultTimerSeconds),
      isTimerCustomizable,
      allowElimination,
      turnStrategy,
      instructions,
      cards: filteredCards
    };

    const targetGameTitle = isExtension ? (gamesList.find(g => g.id === targetGameId)?.title || targetGameId) : packName;

    try {
      const res = await fetch('http://localhost:8000/api/creator/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          game_title: isExtension ? `إضافة بطاقات لـ ${targetGameTitle}` : packName,
          game_type: isExtension ? 'extension' : mode,
          json_payload: JSON.stringify(payload, null, 2),
          is_extension: isExtension,
          target_game_id: isExtension ? targetGameId : null
        })
      });
      if (res.ok) {
        alert("سيتم مراجعة طلبك وإضافته خلال 3 أيام كحد أقصى");
        window.location.reload();
      } else {
        const data = await res.json();
        alert("خطأ: " + (data.detail || "حدث خطأ غير معروف"));
      }
    } catch (err) {
      console.error(err);
      alert("فشل الإرسال.");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">جاري التحميل...</div>;

  return (
    <>
      <PortalNav />
      <div className="max-w-4xl mx-auto p-4 sm:p-8 mt-6">
        <h1 className="text-3xl font-black mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">لوحة تحكم الصانع</h1>
        
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-slate-300 border-b border-slate-800 pb-2">ألعابك السابقة</h2>
          {submissions.length > 0 ? (
            <ul className="space-y-4">
              {submissions.map(sub => (
                <li key={sub.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-800/50 transition">
                  <div>
                    <strong className="text-lg text-white">{sub.game_title}</strong> <span className="text-slate-500 text-sm">({sub.game_type})</span>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center space-x-3 space-x-reverse">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${sub.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : ''}
                      ${sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : ''}
                      ${sub.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : ''}
                      ${sub.status === 'blocked' ? 'bg-slate-700/50 text-slate-400 border border-slate-600' : ''}
                    `}>
                      {sub.status === 'pending' && 'قيد المراجعة'}
                      {sub.status === 'approved' && 'مقبول'}
                      {sub.status === 'rejected' && 'مرفوض'}
                      {sub.status === 'blocked' && 'محظور'}
                    </span>
                    {sub.status === 'rejected' && sub.rejection_reason && (
                      <p className="text-xs text-rose-400 font-medium">السبب: {sub.rejection_reason}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">لم تقم بإضافة أي ألعاب بعد.</p>
          )}
        </div>

        {hasPending ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl">
            <p className="text-yellow-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              لديك طلب قيد المراجعة حالياً. يرجى الانتظار حتى يتم البت فيه قبل إضافة طلب جديد.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">إضافة حزمة ألعاب جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium text-lg">هل تريد إضافة بطاقات للعبة موجودة مسبقاً؟ (Extension Pack)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isExtension} onChange={e => setIsExtension(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                {isExtension && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-400 mb-2">اختر اللعبة</label>
                    <select 
                      value={targetGameId} 
                      onChange={e => {
                        setTargetGameId(e.target.value);
                        const selectedGame = gamesList.find(g => g.id === e.target.value);
                        if (selectedGame) {
                          setEngineTemplate(selectedGame.engineTemplate || 'hot-potato');
                          if (selectedGame.engineTemplate === 'mcq') setCards([{ question: '', answer: '' }]);
                          else if (selectedGame.engineTemplate === 'taboo') setCards([{ word: '', forbidden: '' }]);
                          else setCards(['']);
                        }
                      }} 
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      required
                    >
                      <option value="" disabled>-- اختر لعبة --</option>
                      {gamesList.map(g => (
                        <option key={g.id} value={g.id}>{g.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {!isExtension && (
                <>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
                    <h3 className="text-lg font-bold text-indigo-400">المعلومات الأساسية</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">اسم اللعبة / الحزمة</label>
                        <input type="text" value={packName} onChange={e => setPackName(e.target.value)} required={!isExtension} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">اسم الصانع</label>
                        <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} required={!isExtension} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">نوع المحرك (Engine Template)</label>
                        <select value={engineTemplate} onChange={e => setEngineTemplate(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition">
                          <option value="hot-potato">البطاطس الساخنة (Hot Potato)</option>
                          <option value="classic">كلاسيكي دوري (Classic)</option>
                          <option value="mcq">سؤال وجواب (MCQ/Trivia)</option>
                          <option value="taboo">كلمات ممنوعة (Taboo)</option>
                          <option value="imposter">الجاسوس (Spy/Imposter)</option>
                          <option value="turn-based">مبني على الأدوار (Turn-Based)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">نمط اللعب (Mode)</label>
                        <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition">
                          <option value="multi-team">فرق متعددة (Multi-team)</option>
                          <option value="individual">فردي (Individual)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">لون السمة (Theme Color)</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="h-12 w-12 rounded cursor-pointer bg-slate-900 border border-slate-700" />
                          <span className="text-slate-300 font-mono">{themeColor}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">الأيقونة (إيموجي)</label>
                        <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="مثال: 💣" maxLength={5} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-2xl text-center focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">إرشادات اللعب (Instructions)</label>
                      <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} placeholder="اكتب تعليمات وشروط اللعبة هنا..." className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"></textarea>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
                    <h3 className="text-lg font-bold text-indigo-400">إعدادات اللعب</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-slate-300 font-medium">هل تحتوي على عداد وقت؟ (hasTimer)</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={hasTimer} onChange={e => setHasTimer(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                    
                    {hasTimer && (
                      <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800/50">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-400 mb-2">الوقت الافتراضي بالثواني</label>
                          <input type="number" value={defaultTimerSeconds} onChange={e => setDefaultTimerSeconds(Number(e.target.value))} className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <label className="block text-sm font-medium text-slate-400 mb-2">الوقت قابل للتعديل من اللاعبين؟</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isTimerCustomizable} onChange={e => setIsTimerCustomizable(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-slate-300 font-medium">تفعيل نظام الإقصاء (allowElimination)</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={allowElimination} onChange={e => setAllowElimination(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>

                    {['classic', 'mcq', 'taboo', 'turn-based'].includes(engineTemplate) && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800 gap-4">
                        <span className="text-slate-300 font-medium">نظام الإجابة (Turn Strategy)</span>
                        <select value={turnStrategy} onChange={e => setTurnStrategy(e.target.value)} className="p-3 w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition">
                          <option value="sequential">بالدور (شخص/فريق محدد يجيب)</option>
                          <option value="open">مفتوح (الأسرع يجيب ويأخذ النقطة)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Cards Builder */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-indigo-400">البطاقات / التحديات</h3>
                  <span className="text-sm text-slate-500 bg-slate-900 px-3 py-1 rounded-full">إجمالي: {cards.length}</span>
                </div>
                
                <div className="space-y-3">
                  {cards.map((card: any, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 font-mono w-6 text-center pt-3 sm:pt-0">{idx + 1}</span>
                      
                      {engineTemplate === 'mcq' ? (
                        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                           <input type="text" value={card?.question || ''} onChange={e => handleCardChange(idx, { ...card, question: e.target.value })} className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="اكتب السؤال هنا..." required />
                           <input type="text" value={card?.answer || ''} onChange={e => handleCardChange(idx, { ...card, answer: e.target.value })} className="flex-1 p-3 bg-slate-900 border border-emerald-700/50 rounded-xl text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="الإجابة الصحيحة..." required />
                        </div>
                      ) : engineTemplate === 'taboo' ? (
                        <div className="flex-1 flex flex-col gap-3 w-full">
                           <input type="text" value={card?.word || ''} onChange={e => handleCardChange(idx, { ...card, word: e.target.value })} className="w-full p-3 bg-slate-900 border border-indigo-700/50 rounded-xl text-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="الكلمة الرئيسية (التي يجب حزرها)" required />
                           <input type="text" value={card?.forbidden || ''} onChange={e => handleCardChange(idx, { ...card, forbidden: e.target.value })} className="w-full p-3 bg-slate-900 border border-rose-700/50 rounded-xl text-rose-100 focus:ring-2 focus:ring-rose-500 outline-none transition" placeholder="الكلمات الممنوعة (افصل بينها بفاصلة ,)" required />
                        </div>
                      ) : engineTemplate === 'imposter' ? (
                        <input type="text" value={typeof card === 'string' ? card : card?.word || ''} onChange={e => handleCardChange(idx, e.target.value)} className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition w-full" placeholder="اكتب اسم مكان أو كلمة السر..." required />
                      ) : (
                        <input type="text" value={typeof card === 'string' ? card : card?.question || ''} onChange={e => handleCardChange(idx, e.target.value)} className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition w-full" placeholder="اكتب نص التحدي أو البطاقة..." required />
                      )}
                      
                      <button type="button" onClick={() => handleRemoveCard(idx)} className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition sm:self-auto self-end mt-2 sm:mt-0" title="حذف البطاقة">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddCard} className="mt-4 w-full py-3 border-2 border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-xl font-medium transition flex justify-center items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  إضافة بطاقة جديدة
                </button>
              </div>

              <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:shadow-indigo-500/25 hover:shadow-2xl hover:-translate-y-1 transition-all">إرسال للمراجعة</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
