"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { Sparkles, Globe, Zap, Users } from "lucide-react";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/30 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 relative z-10">
        <div className="w-32 h-32 mb-8 relative animate-in fade-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
          <img src="/im7o.png" alt="Im7o Logo" className="relative drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 pb-4 leading-normal bg-gradient-to-b from-amber-100 via-amber-400 to-yellow-700 bg-clip-text text-transparent drop-shadow-xl tracking-tighter">
          {t("heroTitle")}
        </h1>
        <p className="text-2xl md:text-3xl font-medium text-amber-200/80 mb-4 tracking-wide">
          {t("heroSubtitle")}
        </p>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t("heroDesc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-24">
          <Link href="/play" className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xl rounded-full shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_0_50px_0px_rgba(251,191,36,0.8)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
            <Sparkles className="w-6 h-6" /> {t("playNow")}
          </Link>
          <a href="https://github.com/Imhotep-Tech/im7o" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xl rounded-full hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg> {t("exploreCode")}
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full text-right" style={{ textAlign: "inherit" }}>
          <div className="p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-amber-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">{t("offlineTitle")}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{t("offlineDesc")}</p>
          </div>

          <div className="p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-amber-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">{t("cmsTitle")}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{t("cmsDesc")}</p>
          </div>

          <div className="p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-amber-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">{t("enginesTitle")}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{t("enginesDesc")}</p>
          </div>

          <div className="p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-amber-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">{t("teamsTitle")}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{t("teamsDesc")}</p>
          </div>
        </div>

        {/* Developer Callout Section */}
        <div className="mt-20 max-w-4xl mx-auto w-full p-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 rounded-3xl">
          <div className="bg-slate-950/80 backdrop-blur-xl p-8 md:p-12 rounded-[22px] border border-amber-500/10 text-center relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition-colors duration-700 pointer-events-none"></div>
            
            <svg className="w-12 h-12 mx-auto text-amber-400 mb-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">هل أنت مطور؟ ساهم عبر GitHub!</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              إذا كنت تعرف التعامل مع ملفات JSON والـ Pull Requests، نوصي بشدة بإضافة إبداعاتك (ألعاب أو بطاقات) مباشرة عبر مستودعنا. ستحصل على تحكم 100%، وسرعة في مراجعة التعديلات، وستصبح مساهماً (Contributor) رسمياً في منصة Im7o!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://github.com/Imhotep-Tech/im7o/tree/main/docs/CONTRIBUTING-GAMES.md" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                قراءة التوثيق (Docs)
              </a>
              <Link href="/creator" className="px-8 py-4 bg-slate-900 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                دليل إضافة الألعاب
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
