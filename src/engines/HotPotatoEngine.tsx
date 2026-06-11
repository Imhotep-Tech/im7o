"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw, UserMinus, UserPlus, Bomb } from "lucide-react";
import InstructionsModal from "@/components/InstructionsModal";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function HotPotatoEngine({ config }: any) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [setupPhase, setSetupPhase] = useState(true);
  const [entities, setEntities] = useState<any[]>([]);
  const [deck, setDeck] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeEntityIndex, setActiveEntityIndex] = useState(0);
  
  const [customTimer, setCustomTimer] = useState(config.defaultTimerSeconds || 60);
  const [timeLeft, setTimeLeft] = useState(customTimer);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 2000);
    setEntities([
      { id: "e1", name: "فريق 1", score: 0, isEliminated: false },
      { id: "e2", name: "فريق 2", score: 0, isEliminated: false }
    ]);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRoundActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (isRoundActive && timeLeft <= 0) {
      setIsRoundActive(false);
      handleExplosion();
    }
    return () => clearInterval(interval);
  }, [isRoundActive, timeLeft]);

  const startGame = () => {
    if (entities.filter(e => e.name.trim() !== "").length < 2) return;
    setDeck(shuffleArray(config.cards));
    setCurrentCardIndex(0);
    setActiveEntityIndex(0);
    setSetupPhase(false);
    setTimeLeft(customTimer);
  };

  const startRound = () => {
    setIsRoundActive(true);
    setRoundOver(false);
  };

  const handleExplosion = () => {
    setRoundOver(true);
    const updatedEntities = [...entities];
    updatedEntities[activeEntityIndex].isEliminated = true;
    setEntities(updatedEntities);
  };

  const passPhone = () => {
    if (!isRoundActive) return;
    const updatedEntities = [...entities];
    let nextIndex = (activeEntityIndex + 1) % updatedEntities.length;
    let loopCount = 0;
    while (updatedEntities[nextIndex].isEliminated && loopCount < updatedEntities.length) {
      nextIndex = (nextIndex + 1) % updatedEntities.length;
      loopCount++;
    }
    setActiveEntityIndex(nextIndex);
    setCurrentCardIndex(prev => (prev + 1) % deck.length);
  };

  const nextRoundSetup = () => {
    let nextIndex = (activeEntityIndex + 1) % entities.length;
    let loopCount = 0;
    while (entities[nextIndex].isEliminated && loopCount < entities.length) {
      nextIndex = (nextIndex + 1) % entities.length;
      loopCount++;
    }
    setActiveEntityIndex(nextIndex);
    setRoundOver(false);
    setTimeLeft(customTimer);
  };

  const restartGame = () => {
    setEntities(entities.map(e => ({ ...e, score: 0, isEliminated: false })));
    setDeck(shuffleArray(config.cards));
    setCurrentCardIndex(0);
    setActiveEntityIndex(0);
    setRoundOver(false);
    setTimeLeft(customTimer);
  };

  const activeTeamsCount = entities.filter(e => !e.isEliminated).length;
  const isGameOver = activeTeamsCount <= 1;

  if (showOverlay) return <Overlay config={config} />;
  if (setupPhase) return <Setup config={config} entities={entities} setEntities={setEntities} startGame={startGame} customTimer={customTimer} setCustomTimer={setCustomTimer} />;
  if (isGameOver) return <GameOver config={config} entities={entities} restartGame={restartGame} />;

  const activeEntity = entities[activeEntityIndex];
  const isLow = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-950 overflow-hidden relative">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          <Info className="w-4 h-4" /> تعليمات اللعبة
        </button>
        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          رجوع <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
      </header>

      <div className={`w-full py-6 flex flex-col items-center justify-center border-b transition-colors duration-300 ${isLow ? 'bg-red-500/20 border-red-500/50 animate-pulse' : 'bg-slate-900 border-slate-800'}`}>
        <div className={`text-7xl font-black font-mono tracking-widest ${isLow ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'text-slate-100'}`}>
          {timeLeft.toString().padStart(2, '0')}
        </div>
        <div className="text-slate-400 text-sm font-medium mt-2 uppercase tracking-widest">الوقت المتبقي للقنبلة</div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-6 pb-12 w-full max-w-md mx-auto">
        {!isRoundActive && !roundOver ? (
          <div className="text-center bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-2xl font-bold text-white mb-3">الدور يبدأ عند فريق:</h2>
            <h3 className="text-5xl font-black mb-8 drop-shadow-md" style={{ color: config.themeColor }}>{activeEntity.name}</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              هل أنتم مستعدون؟ الكلمة ستظهر والعداد سيبدأ! بمجرد أن يحزر زميلك الكلمة، اضغط زر (مرر الموبايل) وأعطه للفريق التالي بسرعة!
            </p>
            <button onClick={startRound} className="w-full py-5 rounded-2xl font-bold text-2xl text-white shadow-2xl active:scale-95 transition-transform" style={{ backgroundColor: config.themeColor }}>
              ابدأ الجولة!
            </button>
          </div>
        ) : roundOver ? (
          <div className="text-center bg-red-950 p-8 rounded-[3rem] border border-red-500/50 w-full shadow-2xl">
            <div className="text-7xl mb-6 animate-bounce">💥</div>
            <h2 className="text-4xl font-black text-white mb-4">انفجرت القنبلة!</h2>
            <p className="text-red-300 text-xl font-medium mb-10">تم إقصاء فريق <strong className="text-white text-2xl block mt-2">{activeEntity.name}</strong></p>
            <button onClick={nextRoundSetup} className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-slate-800 hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700 shadow-xl">
              الجولة التالية ({activeTeamsCount} فرق متبقية)
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-slate-500 font-medium text-sm mb-2 block uppercase tracking-widest">الدور والموبايل عند</span>
              <h2 className="text-4xl font-black text-white drop-shadow-md" style={{ color: config.themeColor }}>
                {activeEntity.name}
              </h2>
            </div>
            
            <div className="w-full bg-slate-900 border-2 rounded-[3rem] p-10 min-h-[300px] flex items-center justify-center text-center shadow-2xl relative" style={{ borderColor: `${config.themeColor}50`, boxShadow: `0 20px 40px -10px ${config.themeColor}30` }}>
               <p className="text-4xl md:text-5xl font-bold text-white leading-tight z-10 drop-shadow-lg">{typeof deck[currentCardIndex] === 'string' ? deck[currentCardIndex] : (deck[currentCardIndex]?.question || '')}</p>
            </div>

            <button onClick={passPhone} className="w-full py-6 rounded-3xl text-white font-bold text-3xl border-b-8 active:border-b-0 active:translate-y-2 transition-all mt-4 shadow-xl" style={{ backgroundColor: '#10B981', borderColor: '#059669', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}>
              إجابة صحيحة - مرر الموبايل!
            </button>
          </>
        )}
      </main>
      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} instructions={config.instructions} themeColor={config.themeColor} />
    </div>
  );
}

function Overlay({ config }: any) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-500" style={{ backgroundColor: config.themeColor }}>
      <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-pulse">
        <Bomb className="w-16 h-16" />
      </div>
      <h1 className="text-5xl font-black drop-shadow-lg tracking-tighter">{config.title}</h1>
      {config.author && (
        <p className="mt-4 text-white/90 font-medium text-lg drop-shadow-md bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
          تم الإنشاء بواسطة: <span className="font-bold">{config.author}</span>
        </p>
      )}
    </div>
  );
}

function Setup({ config, entities, setEntities, startGame, customTimer, setCustomTimer }: any) {
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
          <Link href="/" className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors active:scale-95 shadow-lg"><ArrowRight className="w-6 h-6 rotate-180" /></Link>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="space-y-4">
            {entities.map((ent: any, idx: number) => (
              <div key={ent.id} className="flex items-center gap-4 group">
                 <span className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">{idx + 1}</span>
                 <input type="text" value={ent.name} onChange={e => { const ne = [...entities]; ne[idx].name = e.target.value; setEntities(ne); }} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all" placeholder={`اسم الفريق`} />
                 {entities.length > 2 && (
                    <button onClick={() => setEntities(entities.filter((_:any, i:number) => i !== idx))} className="p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all active:scale-95 shrink-0"><UserMinus className="w-6 h-6" /></button>
                 )}
              </div>
            ))}
          </div>
          <button onClick={() => setEntities([...entities, { id: Date.now().toString(), name: `فريق ${entities.length + 1}`, score: 0, isEliminated: false }])} className="mt-6 w-full py-5 rounded-2xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-3 font-medium active:scale-95">
             <UserPlus className="w-6 h-6" /> إضافة فريق
          </button>
          
          {config.isTimerCustomizable && (
            <div className="mt-8 flex flex-col gap-2">
              <label className="text-slate-400 text-sm font-medium">زمن القنبلة (بالثواني)</label>
              <input type="number" value={customTimer} onChange={e => setCustomTimer(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono text-lg" />
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

function GameOver({ config, entities, restartGame }: any) {
  const winner = entities.find((e: any) => !e.isEliminated);
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 p-6 items-center justify-center">
      <div className="text-center w-full max-w-md bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-2" style={{ backgroundColor: config.themeColor }}></div>
         <h2 className="text-5xl font-black text-white mb-6 mt-4">النهاية!</h2>
         <p className="text-slate-400 text-xl mb-6">الفريق الفائز والناجي من القنبلة هو:</p>
         <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-10 shadow-inner">
           <h3 className="text-4xl font-black text-emerald-400 flex items-center justify-center gap-4">
             <span className="text-4xl animate-bounce">🏆</span> {winner?.name}
           </h3>
         </div>
         <button onClick={restartGame} className="w-full py-5 rounded-2xl font-bold text-xl text-white shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all" style={{ backgroundColor: config.themeColor }}>
            <RotateCcw className="w-6 h-6" /> العبوا مرة أخرى
         </button>
      </div>
    </div>
  );
}
