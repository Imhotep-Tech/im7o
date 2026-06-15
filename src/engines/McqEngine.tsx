"use client";

import { useState, useEffect } from "react";
import Timer from "@/components/Timer";
import { GameProps } from "@/utils/gameUtils";
import { useGameEngine } from "@/hooks/useGameEngine";
import BaseEngineLayout from "@/components/BaseEngineLayout";

export default function McqEngine({ config }: GameProps) {
  const engineState = useGameEngine(config);
  const [showAnswer, setShowAnswer] = useState(false);
  const [prevCardIndex, setPrevCardIndex] = useState(0);

  const {
    entities,
    deck,
    currentCardIndex,
    activeEntity,
    customTimer,
    turnStrategy,
    handleScore,
    handleOpenScore,
    skipCard,
    passTurn,
    eliminateActive
  } = engineState;

  if (currentCardIndex !== prevCardIndex) {
    setPrevCardIndex(currentCardIndex);
    setShowAnswer(false);
  }

  return (
    <BaseEngineLayout config={config} engineState={engineState}>
      <div className="text-center">
        {turnStrategy === "open" ? (
          <h2 className="text-3xl font-black text-white drop-shadow-md mb-2" style={{ color: config.themeColor }}>
            سؤال مفتوح للجميع
          </h2>
        ) : (
          <>
            <span className="text-slate-500 font-medium text-sm mb-2 block uppercase tracking-widest">الدور على</span>
            <h2 className="text-4xl font-black text-white drop-shadow-md" style={{ color: config.themeColor }}>
              {activeEntity?.name}
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
    </BaseEngineLayout>
  );
}
