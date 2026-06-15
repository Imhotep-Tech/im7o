"use client";
import { useState, useEffect } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export default function SyncButton() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSync = () => {
    if (isOffline) {
      alert("أنت غير متصل بالإنترنت حالياً. لا يمكن مزامنة الألعاب الجديدة.");
      return;
    }
    setIsSyncing(true);
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={handleSync} 
      disabled={isSyncing}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all z-50 ${
        isOffline 
          ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed" 
          : "bg-indigo-600/90 text-white hover:bg-indigo-500 border border-indigo-500/50 backdrop-blur-md hover:scale-105 active:scale-95"
      }`}
      title="مزامنة للحصول على أحدث الألعاب"
    >
      {isOffline ? (
        <><WifiOff className="w-4 h-4" /> وضع عدم الاتصال</>
      ) : (
        <><RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} /> تحديث الألعاب</>
      )}
    </button>
  );
}
