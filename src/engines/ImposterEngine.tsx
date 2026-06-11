"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw, UserMinus, UserPlus, Users, Eye, EyeOff } from "lucide-react";
import InstructionsModal from "@/components/InstructionsModal";
import Timer from "@/components/Timer";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ImposterEngine({ config }: any) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [setupPhase, setSetupPhase] = useState(true);
  const [entities, setEntities] = useState<any[]>([]);
  
  const [secretWord, setSecretWord] = useState<string>("");
  const [spyId, setSpyId] = useState<string>("");
  const [viewingIndex, setViewingIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [customTimer, setCustomTimer] = useState(config.defaultTimerSeconds || 300); // 5 mins

  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 2000);
    setEntities([
      { id: "e1", name: "اللاعب 1" },
      { id: "e2", name: "اللاعب 2" },
      { id: "e3", name: "اللاعب 3" }
    ]);
    return () => clearTimeout(t);
  }, []);

  const startGame = () => {
    if (entities.length < 3) return; // Spyfall needs at least 3
    
    // Pick a random location/word
    const randomCard = config.cards[Math.floor(Math.random() * config.cards.length)];
    const word = typeof randomCard === 'string' ? randomCard : (randomCard?.word || randomCard?.question || "مكان مجهول");
    setSecretWord(word);
    
    // Pick spy
    const randomSpy = entities[Math.floor(Math.random() * entities.length)].id;
    setSpyId(randomSpy);
    
    setViewingIndex(0);
    setIsRevealed(false);
    setGameStarted(false); // Game actually starts after everyone views
    setSetupPhase(false);
  };

  const nextViewer = () => {
    if (viewingIndex >= entities.length - 1) {
      setGameStarted(true);
    } else {
      setViewingIndex(prev => prev + 1);
      setIsRevealed(false);
    }
  };

  const restartGame = () => {
    setSetupPhase(true);
    setGameStarted(false);
    setIsRevealed(false);
    setViewingIndex(0);
  };

  if (showOverlay) {
    return (
      <div className="flex flex-col min-h-[100dvh] items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="z-10 text-center animate-bounce mb-8 text-6xl">🕵️‍♂️</div>
        <h1 className="z-10 text-5xl md:text-7xl font-black text-white mb-6 text-center tracking-tight">{config.title}</h1>
        <div className="z-10 w-24 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (setupPhase) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 p-4 pt-12 md:pt-20">
        <div className="max-w-lg w-full mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black text-white">{config.title}</h1>
            </div>
            <Link href="/" className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all shadow-lg"><ArrowRight className="w-6 h-6 rotate-180" /></Link>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-200 mb-8 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" /> إعداد اللاعبين
            </h2>
            
            <div className="space-y-4">
              {entities.map((ent, idx) => (
                <div key={ent.id} className="flex items-center gap-4 group">
                  <span className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">{idx + 1}</span>
                  <input
                    type="text"
                    value={ent.name}
                    onChange={(e) => {
                      const newEnts = [...entities];
                      newEnts[idx].name = e.target.value;
                      setEntities(newEnts);
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                    placeholder={`اسم اللاعب`}
                  />
                  {entities.length > 3 && (
                    <button onClick={() => setEntities(entities.filter((_, i) => i !== idx))} className="p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all shrink-0 active:scale-95"><UserMinus className="w-6 h-6" /></button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => setEntities([...entities, { id: Date.now().toString(), name: `اللاعب ${entities.length + 1}` }])} className="mt-6 w-full py-5 rounded-2xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-3 font-medium active:scale-95">
              <UserPlus className="w-6 h-6" /> إضافة المزيد
            </button>

            {config.hasTimer && config.isTimerCustomizable && (
              <div className="mt-8 flex flex-col gap-2">
                <label className="text-slate-400 text-sm font-medium">زمن النقاش (بالثواني)</label>
                <input 
                  type="number" 
                  value={customTimer} 
                  onChange={(e) => setCustomTimer(Number(e.target.value))} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            )}

            <button onClick={startGame} disabled={entities.length < 3} className="mt-10 w-full py-5 rounded-[1.5rem] text-white font-bold text-xl shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale" style={{ backgroundColor: config.themeColor, boxShadow: `0 10px 25px -5px ${config.themeColor}50` }}>
              توزيع الأدوار
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    const activePlayer = entities[viewingIndex];
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 p-6 items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl text-center">
          {!isRevealed ? (
            <>
              <EyeOff className="w-16 h-16 text-slate-500 mx-auto mb-6" />
              <p className="text-slate-400 font-medium mb-2">قم بتمرير الهاتف إلى:</p>
              <h2 className="text-4xl font-black text-white mb-10">{activePlayer.name}</h2>
              <button onClick={() => setIsRevealed(true)} className="w-full py-5 rounded-2xl font-bold text-xl text-white shadow-xl active:scale-95 transition-all" style={{ backgroundColor: config.themeColor }}>
                أنا {activePlayer.name}، اكشف بطاقتي
              </button>
            </>
          ) : (
            <>
              <Eye className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <p className="text-slate-400 font-medium mb-2">أنت:</p>
              {activePlayer.id === spyId ? (
                <div className="mb-10">
                  <h2 className="text-5xl font-black text-rose-500 mb-2 drop-shadow-lg">الجاسوس!</h2>
                  <p className="text-rose-400/80 font-medium text-sm mt-4">لا تدعهم يكتشفون هويتك. حاول معرفة المكان من أسئلتهم!</p>
                </div>
              ) : (
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-indigo-400 mb-2">{secretWord}</h2>
                  <p className="text-indigo-400/80 font-medium text-sm mt-4">اسأل أسئلة لا يعرف إجابتها سوى من هو في هذا المكان.</p>
                </div>
              )}
              <button onClick={nextViewer} className="w-full py-5 rounded-2xl bg-slate-800 text-white font-bold text-xl shadow-xl active:scale-95 transition-all hover:bg-slate-700">
                أخفِ البطاقة ومرر الهاتف
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-950 overflow-hidden relative">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          <Info className="w-4 h-4" /> تعليمات اللعبة
        </button>
        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          إنهاء اللعبة <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-6 w-full max-w-md mx-auto text-center">
        <h2 className="text-3xl font-black text-white drop-shadow-md">مرحلة التحقيق والاستجواب!</h2>
        <p className="text-slate-400">ابدأوا بطرح الأسئلة لبعضكم البعض لاكتشاف الجاسوس.</p>
        
        {config.hasTimer && (
          <div className="my-8 w-full">
            <Timer defaultSeconds={customTimer} themeColor={config.themeColor} />
          </div>
        )}

        <div className="w-full mt-auto">
          <button onClick={restartGame} className="w-full py-5 rounded-3xl font-bold text-xl text-white shadow-2xl active:scale-95 transition-all" style={{ backgroundColor: config.themeColor }}>
            كشف الجاسوس ولعب دور جديد!
          </button>
        </div>
      </main>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} instructions={config.instructions || "في هذه اللعبة الجميع يحصلون على نفس المكان ماعدا شخص واحد يحصل على الجاسوس. اطرحوا أسئلة على بعضكم البعض لاكتشاف الجاسوس دون كشف المكان."} themeColor={config.themeColor} />
    </div>
  );
}
