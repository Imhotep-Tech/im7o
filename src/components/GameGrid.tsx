import Link from "next/link";
import { Users, User, UsersRound, Bomb } from "lucide-react";

export default function GameGrid({ games }: { games: any[] }) {
  const renderLogo = (logo: string) => {
    // Check if the logo is a known string, else treat it as an emoji or short string.
    switch (logo) {
      case "individual": return <User className="w-8 h-8" />;
      case "two-team": return <Users className="w-8 h-8" />;
      case "multi-team": return <UsersRound className="w-8 h-8" />;
      case "bomb": return <Bomb className="w-8 h-8" />;
      default: return <span className="text-3xl">{logo || "𓋹"}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4 pb-16">
      {games.map((game, index) => (
        <Link
          key={game.id}
          href={`/${game.id}`}
          className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8"
          style={{ animationDelay: `${index * 100}ms`, boxShadow: `0 4px 20px -5px ${game.themeColor}30` }}
        >
          {/* Subtle Egyptian geometric background pattern inside card */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(251,191,36,0.2) 0%, transparent 60%)' }}></div>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ backgroundColor: game.themeColor }}
          />
          <div 
            className="relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{ backgroundColor: game.themeColor, boxShadow: `0 0 30px -5px ${game.themeColor}` }}
          >
            <div className="absolute inset-0 border-[3px] border-amber-400/20 rounded-full scale-110"></div>
            {renderLogo(game.logo)}
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-2 tracking-wide group-hover:text-amber-300 transition-colors">{game.title}</h2>
          <div className="flex gap-3 text-xs font-bold">
            <span className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-950/50 text-amber-100 shadow-inner">
              {game.hasTimer ? "⏳ مؤقت" : "✨ مفتوح"}
            </span>
            <span className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-950/50 text-amber-100 shadow-inner">
              {game.allowElimination ? "⚔️ إقصاء" : "🛡️ حماية"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
