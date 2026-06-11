"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function AppSplash({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 500); // Wait for fade transition
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative flex items-center justify-center mb-6">
          <img src="/im7o.png" alt="Im7o Logo" className="w-24 h-24 animate-bounce drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">إيمحو</h1>
        <p className="text-indigo-400 font-medium tracking-wide">Im7o</p>
        
        <div className="mt-12 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    </div>
  );
}
