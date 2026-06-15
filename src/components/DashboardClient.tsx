"use client";

import { useState } from "react";
import AppSplash from "@/components/AppSplash";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";

export default function DashboardClient({ games }: { games: any[] }) {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <>
      {!splashComplete && <AppSplash onComplete={() => setSplashComplete(true)} />}
      
      <main className={`flex-1 flex flex-col items-center pt-16 transition-opacity duration-1000 ${splashComplete ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-12 px-4 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
            <img src="/im7o.png" alt="Im7o Logo" className="relative w-28 h-28 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-in zoom-in duration-1000" />
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg tracking-wider">
            إيمحو
          </h1>
          <p className="text-amber-200/70 text-xl font-medium tracking-wide">اختر أسطورتك وابدأ التحدي 𓋹</p>
          <a href="http://localhost:8000/api/auth/login" className="inline-block mt-10 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-lg rounded-full shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)] hover:shadow-[0_0_40px_0px_rgba(251,191,36,0.7)] hover:-translate-y-1 transition-all duration-300">
            + أصنع لعبة جديدة
          </a>
        </div>

        <GameGrid games={games} />
      </main>

      {splashComplete && <Footer />}
    </>
  );
}
