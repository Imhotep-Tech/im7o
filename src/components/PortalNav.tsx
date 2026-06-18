"use client";

import React from 'react';
import Link from 'next/link';

export default function PortalNav() {
  return (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center w-full sticky top-0 z-50">
      <div className="flex items-center space-x-4 space-x-reverse">
        <Link href="/">
           <img src="/im7o.png" alt="Im7o Logo" className="h-10 cursor-pointer" />
        </Link>
        <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Im7o Games</span>
      </div>
      <div className="flex items-center space-x-4 space-x-reverse">
         <Link href="/play" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 rounded-xl hover:shadow-amber-500/25 hover:shadow-lg font-bold transition-all text-sm">ابدأ اللعب</Link>
      </div>
    </nav>
  );
}
