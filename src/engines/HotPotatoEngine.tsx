"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import InstructionsModal from "@/components/InstructionsModal";
import GameOverlay from "@/components/GameOverlay";
import GameSetup from "@/components/GameSetup";
import GameOver from "@/components/GameOver";
import { shuffleArray } from "@/utils/gameUtils";
import { GameProps } from "@/utils/gameUtils";

export default function HotPotatoEngine({ config }: GameProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [setupPhase, setSetupPhase] = useState(true);
  const [entities, setEntities] = useState<any[]>([
    { id: "e1", name: "فريق 1", score: 0, isEliminated: false },
    { id: "e2", name: "فريق 2", score: 0, isEliminated: false }
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return () => clearTimeout(t);
  }, []);

  const handleExplosion = () => {
    setRoundOver(true);
    const updatedEntities = [...entities];
    updatedEntities[activeEntityIndex].isEliminated = true;
    setEntities(updatedEntities);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRoundActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (isRoundActive && timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRoundActive(false);
      handleExplosion();
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (showOverlay) return <GameOverlay title={config.title} themeColor={config.themeColor} logo={config.logo} author={config.author} />;
  
  if (setupPhase) return (
    <GameSetup 
      config={config} 
      entities={entities} 
      setEntities={setEntities} 
      customTimer={customTimer} 
      setCustomTimer={setCustomTimer} 
      startGame={startGame} 
      timerLabel="زمن القنبلة (بالثواني)"
    />
  );
  
  if (isGameOver) return (
    <div className="flex flex-col min-h-screen bg-slate-950 p-6 items-center justify-center">
      <GameOver entities={entities} themeColor={config.themeColor} restartGame={restartGame} winnerOnly />
    </div>
  );

  const activeEntity = entities[activeEntityIndex];
  const isLow = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-950 overflow-hidden relative">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
          <Info className="w-4 h-4" /> تعليمات اللعبة
        </button>
        <Link href="/play" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
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
            <h3 className="text-5xl font-black mb-8 drop-shadow-md" style={{ color: config.themeColor }}>{activeEntity?.name}</h3>
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
            <p className="text-red-300 text-xl font-medium mb-10">تم إقصاء فريق <strong className="text-white text-2xl block mt-2">{activeEntity?.name}</strong></p>
            <button onClick={nextRoundSetup} className="w-full py-5 rounded-2xl font-bold text-xl text-white bg-slate-800 hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700 shadow-xl">
              الجولة التالية ({activeTeamsCount} فرق متبقية)
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-slate-500 font-medium text-sm mb-2 block uppercase tracking-widest">الدور والموبايل عند</span>
              <h2 className="text-4xl font-black text-white drop-shadow-md" style={{ color: config.themeColor }}>
                {activeEntity?.name}
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
