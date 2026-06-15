"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Info, Eye, EyeOff } from "lucide-react";
import InstructionsModal from "@/components/InstructionsModal";
import Timer from "@/components/Timer";
import GameOverlay from "@/components/GameOverlay";
import GameSetup from "@/components/GameSetup";
import GameOver from "@/components/GameOver"; // Assuming game over might be used if they add scores, but not used now in this specific flow
import { GameProps } from "@/utils/gameUtils";

export default function ImposterEngine({ config }: GameProps) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [setupPhase, setSetupPhase] = useState(true);
  const [entities, setEntities] = useState<any[]>([
    { id: "e1", name: "اللاعب 1" },
    { id: "e2", name: "اللاعب 2" },
    { id: "e3", name: "اللاعب 3" }
  ]);
  
  const [secretWord, setSecretWord] = useState<string>("");
  const [spyId, setSpyId] = useState<string>("");
  const [viewingIndex, setViewingIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [customTimer, setCustomTimer] = useState(config.defaultTimerSeconds || 300); // 5 mins

  useEffect(() => {
    const t = setTimeout(() => setShowOverlay(false), 2000);
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

  if (showOverlay) return <GameOverlay title={config.title} themeColor={config.themeColor} logo={config.logo} author={config.author} />;

  if (setupPhase) return (
    <GameSetup 
      config={config} 
      entities={entities} 
      setEntities={setEntities} 
      customTimer={customTimer} 
      setCustomTimer={setCustomTimer} 
      startGame={startGame} 
      minEntities={3}
      timerLabel="زمن النقاش (بالثواني)"
    />
  );

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
        <Link href="/play" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full text-slate-300 hover:text-white transition-all font-medium text-sm border border-slate-800 active:scale-95">
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
