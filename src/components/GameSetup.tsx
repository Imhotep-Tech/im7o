import Link from "next/link";
import { ArrowRight, UserMinus, UserPlus, Users } from "lucide-react";
import { Entity, GameConfig } from "@/utils/gameUtils";

interface GameSetupProps {
  config: GameConfig;
  entities: Entity[];
  setEntities: (entities: Entity[]) => void;
  customTimer: number;
  setCustomTimer: (timer: number) => void;
  startGame: () => void;
  minEntities?: number;
  timerLabel?: string;
}

export default function GameSetup({ config, entities, setEntities, customTimer, setCustomTimer, startGame, minEntities = 2, timerLabel = "زمن العداد (بالثواني)" }: GameSetupProps) {
  const isStartDisabled = entities.filter(e => e.name.trim() !== "").length < minEntities;

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
          <div className="mb-8 p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-slate-300 mb-3">كيف تلعب؟ (تعليمات اللعبة)</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-line">
              {config.instructions || "لا توجد تعليمات مخصصة لهذه اللعبة."}
            </p>
          </div>

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
              <label className="text-slate-400 text-sm font-medium">{timerLabel}</label>
              <input 
                type="number" 
                value={customTimer} 
                onChange={(e) => setCustomTimer(Number(e.target.value))} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          <button 
            onClick={startGame} 
            disabled={isStartDisabled}
            className="mt-10 w-full py-5 rounded-[1.5rem] text-white font-bold text-xl shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale" 
            style={{ backgroundColor: config.themeColor, boxShadow: `0 10px 25px -5px ${config.themeColor}50` }}
          >
            جاهزين، ابدأ!
          </button>
        </div>
      </div>
    </div>
  );
}
