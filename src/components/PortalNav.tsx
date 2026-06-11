"use client";

import React, { useEffect, useState } from 'react';

export default function PortalNav() {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/auth/me', { credentials: 'include' })
    .then(res => {
      if(res.ok) return res.json();
      throw new Error('Not logged in');
    })
    .then(data => {
      if(data && data.email) setUser(data);
    })
    .catch(() => {});
  }, []);

  return (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center w-full sticky top-0 z-50">
      <div className="flex items-center space-x-4 space-x-reverse">
        <img src="/im7o.png" alt="Im7o Logo" className="h-10" />
        <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Im7o Portal</span>
      </div>
      <div className="flex items-center space-x-4 space-x-reverse">
        {user ? (
          <>
            <span className="text-slate-300">مرحباً، {user.name}</span>
            {user.is_admin && <a href="/admin" className="text-indigo-400 hover:text-indigo-300 transition text-sm font-bold">لوحة الإدارة</a>}
            <a href="http://localhost:8000/api/auth/logout" className="text-rose-400 hover:text-rose-300 transition text-sm font-bold">تسجيل الخروج</a>
          </>
        ) : (
          <a href="http://localhost:8000/api/auth/login" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-indigo-500/25 hover:shadow-lg font-bold transition-all text-sm">تسجيل الدخول</a>
        )}
      </div>
    </nav>
  );
}
