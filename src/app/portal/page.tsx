"use client";
import React from 'react';
import PortalNav from '../../components/PortalNav';

export default function PortalHome() {
  return (
    <>
      <PortalNav />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <img src="/im7o.png" alt="Im7o Logo" className="h-32 mb-8 drop-shadow-lg" />
        <h1 className="text-5xl font-black mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">بوابة صناع إيمحو</h1>
        <div className="flex flex-col sm:flex-row gap-6">
            <a href="http://localhost:8000/api/auth/login" className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 text-xl font-bold transition-all text-center">تسجيل الدخول</a>
        </div>
      </div>
    </>
  );
}
