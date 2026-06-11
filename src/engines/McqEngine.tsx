"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw, UserMinus, UserPlus, Users, User } from "lucide-react";
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

interface Entity {
  id: string;
  name: string;
  score: number;
  isEliminated: boolean;
}

interface GameProps {
  config: {
    id: string;
    mode: string;
    title: string;
    hasTimer: boolean;
    defaultTimerSeconds?: number;
    isTimerCustomizable?: boolean;
    allowElimination: boolean;
    themeColor: string;
    logo: string;
    instructions: string;
    cards: any[];
    turnStrategy?: "sequential" | "open";
    allowPass?: boolean;
    author?: string;
  };
}

export default function TurnBasedEngine({ config }: GameProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [setupPhase, setSetupPhase] = useState(true);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [deck, setDeck] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeEntityIndex, setActiveEntityIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [customTimer, setCustomTimer] = useState(config.defaultTimerSeconds || 30);
  const [showAnswer, setShowAnswer] = useState(false);

  const turnStrategy = config.turnStrategy || "sequential";

  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 2000);
    
    if (config.mode === "two-team") {
      setEntities([
        { id: "t1", name: "الفريق الأول", score: 0, isEliminated: false },
        { id: "t2", name: "الفريق الثاني", score: 0, isEliminated: false }
      ]);
    } else {
      setEntities([
        { id: "e1", name: config.mode === "individual" ? "اللاعب 1" : "الفريق 1", score: 0, isEliminated: false },
        { id: "e2", name: config.mode === "individual" ? "اللاعب 2" : "الفريق 2", score: 0, isEliminated: false }
      ]);
    }
    
    return () => clearTimeout(t);
  }, [config.mode]);

  const startGame = () => {
    if (entities.filter(e => e.name.trim() !== "").length < 2) return;
    setDeck(shuffleArray(config.cards));
    setCurrentCardIndex(0);
    setActiveEntityIndex(0);
    setSetupPhase(false);
  };

  const restartGame = () => {
    setEntities(entities.map(e => ({ ...e, score: 0, isEliminated: false })));
    setDeck(shuffleArray(config.cards));
    setCurrentCardIndex(0);
    setActiveEntityIndex(0);
  };

  const handleScore = (points: number) => {
    const updatedEntities = [...entities];
    const active = updatedEntities[activeEntityIndex];
    active.score += points;
    setEntities(updatedEntities);
    nextTurn(updatedEntities);
  };

  const handleOpenScore = (entityIdx: number) => {
    const updatedEntities = [...entities];
    updatedEntities[entityIdx].score += 1;
    setEntities(updatedEntities);
    setCurrentCardIndex(prev => prev + 1);
    setShowAnswer(false);
  };

  const skipCard = () => {
    nextTurn(entities);
  };

  const passTurn = () => {
    const currentEntities = [...entities];
    let nextIndex = (activeEntityIndex + 1) % currentEntities.length;
    let loopCount = 0;
    while (currentEntities[nextIndex].isEliminated && loopCount < currentEntities.length) {
      nextIndex = (nextIndex + 1) % currentEntities.length;
      loopCount++;
    }
    setActiveEntityIndex(nextIndex);
  };

  const eliminateActive = () => {
    const updatedEntities = [...entities];
    updatedEntities[activeEntityIndex].isEliminated = true;
    setEntities(updatedEntities);
    nextTurn(updatedEntities);
  };

  const nextTurn = (currentEntities: Entity[]) => {
    let nextIndex = (activeEntityIndex + 1) % currentEntities.length;
    let loopCount = 0;
    while (currentEntities[nextIndex].isEliminated && loopCount < currentEntities.length) {
      nextIndex = (nextIndex + 1) % currentEntities.length;
      loopCount++;
    }
    setActiveEntityIndex(nextIndex);
    setCurrentCardIndex(prev => prev + 1);
  };

  const activeTeamsCount = entities.filter(e => !e.isEliminated).length;
  const isGameOver = currentCardIndex >= deck.length || activeTeamsCount <= 1;

  if (showOverlay) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-500" style={{ backgroundColor: config.themeColor }}>
        <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-pulse">
          {config.logo.includes('team') ? <Users className="w-16 h-16" /> : <User className="w-16 h-16" />}
        </div>
        <h1 className="text-5xl font-black tracking-tighter drop-shadow-lg">{config.title}</h1>
        {config.author && (
          <p className="mt-4 text-white/90 font-medium text-lg drop-shadow-md bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
            تم الإنشاء بواسطة: <span className="font-bold">{config.author}</span>
          </p>
        )}
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
              {config.author && (
                <p className="text-slate-400 text-sm font-medium">تطوير: <span className="text-slate-300 font-bold">{config.author}</span></p>
              )}
            </div>
            <Link href="/" className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all shadow-lg"><ArrowRight className="w-6 h-6 rotate-180" /></Link>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-200 mb-8 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" /> إعداد {config.mode === 'individual' ? 'اللاعبين' : 'الفرق'}
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
                    placeholder={`اسم ${config.mode === 'individual' ? 'اللاعب' : 'الفريق'}`}
                  />
                  {config.mode !== 'two-team' && entities.length > 2 && (
                    <button onClick={() => setEntities(entities.filter((_, i) => i !== idx))} className="p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all shrink-0 active:scale-95"><UserMinus className="w-6 h-6" /></button>
                  )}
                </div>
              ))}
            </div>

            {config.mode !== 'two-team' && (
              <button onClick={() => setEntities([...entities, { id: Date.now().toString(), name: `${config.mode === 'individual' ? 'لاعب' : 'فريق'} ${entities.length + 1}`, score: 0, isEliminated: false }])} className="mt-6 w-full py-5 rounded-2xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-3 font-medium active:scale-95">
                <UserPlus className="w-6 h-6" /> إضافة المزيد
              </button>
            )}

            {config.hasTimer && config.isTimerCustomizable && (
              <div className="mt-8 flex flex-col gap-2">
                <label className="text-slate-400 text-sm font-medium">زمن العداد (بالثواني)</label>
                <input 
                  type="number" 
                  value={customTimer} 
                  onChange={(e) => setCustomTimer(Number(e.target.value))} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            )}

            <button onClick={startGame} className="mt-10 w-full py-5 rounded-[1.5rem] text-white font-bold text-xl shadow-2xl active:scale-[0.98] transition-all" style={{ backgroundColor: config.themeColor, boxShadow: `0 10px 25px -5px ${config.themeColor}50` }}>
              جاهزين، ابدأ!
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeEntity = entities[activeEntityIndex];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-950 overflow-hidden">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          <Info className="w-4 h-4" /> تعليمات اللعبة
        </button>

        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          رجوع <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
      </header>

      <div className="w-full overflow-x-auto pb-6 pt-8 px-4 scrollbar-hide">
        <div className="flex gap-4 w-max mx-auto">
          {entities.map((ent, idx) => (
            <div 
              key={ent.id}
              className={`flex flex-col items-center justify-center px-8 py-4 rounded-3xl border-2 transition-all duration-300 min-w-[140px] ${
                ent.isEliminated 
                  ? 'border-slate-800 bg-slate-900/30 opacity-40 grayscale' 
                  : (idx === activeEntityIndex && turnStrategy === "sequential")
                    ? 'border-current shadow-xl scale-110 z-10 bg-slate-900' 
                    : 'border-slate-800 bg-slate-900 scale-95 opacity-80'
              }`}
              style={{ borderColor: (idx === activeEntityIndex && turnStrategy === "sequential" && !ent.isEliminated) ? config.themeColor : undefined }}
            >
              <span className="text-sm font-bold text-slate-400 truncate max-w-[110px] mb-2">{ent.name}</span>
              <span className="text-3xl font-black text-white">{ent.score}</span>
              {ent.isEliminated && <span className="text-xs text-red-400 font-bold mt-2 bg-red-400/10 px-3 py-1 rounded-full">مقصى</span>}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-6 pb-12 w-full max-w-md mx-auto">
        {!isGameOver ? (
          <>
            <div className="text-center">
              {turnStrategy === "open" ? (
                <h2 className="text-3xl font-black text-white drop-shadow-md mb-2" style={{ color: config.themeColor }}>
                  سؤال مفتوح للجميع
                </h2>
              ) : (
                <>
                  <span className="text-slate-500 font-medium text-sm mb-2 block uppercase tracking-widest">الدور على</span>
                  <h2 className="text-4xl font-black text-white drop-shadow-md" style={{ color: config.themeColor }}>
                    {activeEntity.name}
                  </h2>
                </>
              )}
            </div>

            <div 
              className="w-full bg-slate-900 border-2 rounded-[3rem] p-10 min-h-[300px] flex items-center justify-center text-center shadow-2xl relative overflow-hidden group"
              style={{ borderColor: `${config.themeColor}40`, boxShadow: `0 25px 50px -12px ${config.themeColor}20` }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              {showAnswer ? (
                <div className="z-10 flex flex-col gap-6">
                   <p className="text-xl font-medium text-slate-400 drop-shadow-lg opacity-80">{deck[currentCardIndex]?.question}</p>
                   <p className="text-4xl md:text-5xl font-black text-emerald-400 leading-tight drop-shadow-lg">{deck[currentCardIndex]?.answer}</p>
                </div>
              ) : (
                <p className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg z-10">
                  {typeof deck[currentCardIndex] === 'string' ? deck[currentCardIndex] : (deck[currentCardIndex]?.question || '')}
                </p>
              )}
            </div>
            
            {!showAnswer && (
               <button onClick={() => setShowAnswer(true)} className="w-full max-w-sm py-4 rounded-xl text-white font-bold text-xl shadow-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all" style={{ backgroundColor: config.themeColor, borderColor: '#00000050' }}>
                 إظهار الإجابة
               </button>
            )}

            {config.hasTimer && (
              <Timer defaultSeconds={customTimer} themeColor={config.themeColor} />
            )}

            {turnStrategy === "open" ? (
              <div className="w-full flex flex-col gap-4 mt-auto md:mt-0">
                <p className="text-slate-400 text-sm font-medium text-center">اختر من أجاب بشكل صحيح:</p>
                <div className="grid grid-cols-2 gap-3">
                  {entities.map((ent, idx) => !ent.isEliminated && (
                    <button
                      key={ent.id}
                      onClick={() => handleOpenScore(idx)}
                      className="py-4 rounded-xl text-white font-bold text-lg shadow-md active:scale-95 transition-all"
                      style={{ backgroundColor: config.themeColor }}
                    >
                      {ent.name} (+1)
                    </button>
                  ))}
                </div>
                <button
                  onClick={skipCard}
                  className="w-full py-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-lg active:scale-95 transition-all"
                >
                  لا أحد (تخطي السؤال)
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3 mt-auto md:mt-0">
                <div className="w-full flex gap-4">
                  <button onClick={() => handleScore(0)} className="flex-1 py-5 rounded-2xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-2xl border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all">
                    غلط / 0
                  </button>
                  <button onClick={() => handleScore(1)} className="flex-1 py-5 rounded-2xl text-white font-bold text-2xl border-b-4 shadow-xl active:border-b-0 active:translate-y-1 transition-all" style={{ backgroundColor: config.themeColor, borderColor: '#00000050', boxShadow: `0 12px 24px -6px ${config.themeColor}40` }}>
                    كسب / +1
                  </button>
                </div>
                
                {config.allowPass && (
                  <button onClick={passTurn} className="w-full py-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-lg active:scale-95 transition-all mt-2">
                    مرر السؤال للي بعده ➡️
                  </button>
                )}
              </div>
            )}

            {config.allowElimination && turnStrategy !== "open" && (
              <button onClick={eliminateActive} className="w-full py-4 rounded-2xl bg-slate-900 text-red-500 hover:bg-red-500 hover:text-white font-bold text-lg border border-red-500/30 hover:border-red-500 transition-all active:scale-95 mt-2">
                خروج من اللعبة (إقصاء)
              </button>
            )}
          </>
        ) : (
          <div className="text-center w-full bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2" style={{ backgroundColor: config.themeColor }}></div>
            <h2 className="text-5xl font-black text-white mb-8 mt-4">النهاية!</h2>
            <div className="space-y-4 mb-10">
              {entities.sort((a,b) => b.score - a.score).map((ent, idx) => (
                <div key={ent.id} className={`flex items-center justify-between p-5 rounded-2xl border ${idx === 0 ? 'bg-indigo-500 border-indigo-400 text-white shadow-xl shadow-indigo-500/20 scale-105' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                  <span className="font-bold flex items-center gap-3 text-lg">
                    {idx === 0 && <span className="text-2xl animate-bounce">🏆</span>} {ent.name}
                  </span>
                  <span className="text-2xl font-black">{ent.score} <span className="text-sm font-medium opacity-80">نقطة</span></span>
                </div>
              ))}
            </div>
            <button onClick={restartGame} className="w-full py-5 rounded-2xl font-bold text-xl text-white flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 hover:brightness-110" style={{ backgroundColor: config.themeColor }}>
              <RotateCcw className="w-6 h-6" /> لعب مرة أخرى
            </button>
          </div>
        )}
      </main>

      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} instructions={config.instructions} themeColor={config.themeColor} />
    </div>
  );
}
