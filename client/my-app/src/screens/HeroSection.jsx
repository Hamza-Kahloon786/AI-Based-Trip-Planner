import React, { useEffect } from "react";
import { heroSectionData } from "../constant/Constant.js";
import { useLocation, useNavigate } from "react-router-dom";
import FeaturesSection from "./FeaturesImplementation.jsx";
import TestimonialsSection from "./Testimonials.jsx";
import HowItWorksSection from "./HowToWork.jsx";
import FAQSection from "./FaqSection.jsx";

function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [location.hash]);

  const previewItems = [
    {
      label: "Route Distance",
      value: "1,050 km via KKH",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      label: "Live Weather",
      value: "18°C — Partly Cloudy",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      label: "ML Cost Prediction",
      value: "PKR 95,000 total",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Top Hotel Match",
      value: "Eagle's Nest — ★ 4.8",
      iconBg: "bg-fuchsia-50",
      iconColor: "text-fuchsia-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  const techStrip = ["GPT-4.1 Itineraries", "RandomForest ML", "Google Maps Routing", "Live Weather"];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        {/* Ambient gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 w-[46rem] h-[46rem] rounded-full bg-indigo-600/25 blur-[130px]" />
          <div className="absolute top-1/3 -left-40 w-[38rem] h-[38rem] rounded-full bg-violet-600/20 blur-[130px]" />
          <div className="absolute -bottom-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-emerald-500/15 blur-[130px]" />
        </div>
        {/* Grid overlay with radial fade */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: Copy ── */}
            <div className="animate-rise">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-7">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-200 to-emerald-200 bg-clip-text text-transparent">
                  AI-Powered Trip Planning · Pakistan
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-[3.75rem] font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                Plan your{" "}
                <span className="text-gradient bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
                  perfect trip
                </span>
                
                <br className="hidden sm:block" /> in minutes, not days
              </h1>

              <p className="text-lg text-slate-300/80 leading-relaxed mb-9 max-w-lg">
                Share your preferences and our AI builds a complete, personalized itinerary — with
                real-time routes, live weather, ML-powered budget predictions, and hand-matched hotels.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 mb-12">
                <button
                  onClick={() => navigate('/ai-planning')}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                >
                  Start Planning Free
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/15 backdrop-blur-md transition-all duration-300"
                >
                  See how it works
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {[
                    { bg: "from-indigo-400 to-indigo-600", letter: "A" },
                    { bg: "from-emerald-400 to-emerald-600", letter: "B" },
                    { bg: "from-orange-400 to-orange-600", letter: "C" },
                    { bg: "from-fuchsia-400 to-fuchsia-600", letter: "D" },
                  ].map((a, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.bg} border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold`}>
                      {a.letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-white">5,000+</span> trips planned this month
                </p>
              </div>
            </div>

            {/* ── Right: Preview Card ── */}
            <div className="relative animate-rise" style={{ animationDelay: "0.15s" }}>
              {/* Glow behind card */}
              <div className="absolute inset-4 bg-gradient-to-tr from-indigo-500/40 to-emerald-400/30 blur-3xl rounded-[2rem]" />

              <div className="relative bg-white rounded-2xl shadow-2xl shadow-indigo-950/40 ring-1 ring-white/10 overflow-hidden animate-float-slow">
                <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-6 py-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Your AI Trip Plan</p>
                      <h3 className="text-white font-display font-bold text-xl">Lahore → Hunza Valley</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-xl px-3.5 py-2 text-center ring-1 ring-white/20">
                      <p className="text-white text-lg font-bold leading-none">7</p>
                      <p className="text-indigo-100 text-xs">Days</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {previewItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-colors">
                      <div className={`w-10 h-10 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => navigate('/projects')}>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-indigo-900">Full itinerary generated</p>
                      <p className="text-xs text-indigo-500">10-section AI plan ready to view</p>
                    </div>
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-3 bg-white/95 backdrop-blur rounded-xl shadow-xl ring-1 ring-slate-100 px-3 py-2 flex items-center gap-2 animate-float">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">Live AI Analysis</span>
              </div>

              <div className="absolute -bottom-4 -left-3 bg-white/95 backdrop-blur rounded-xl shadow-xl ring-1 ring-slate-100 px-3 py-2 flex items-center gap-2 animate-float" style={{ animationDelay: "1.2s" }}>
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-slate-800">ML Predictions Active</span>
              </div>
            </div>
          </div>

          {/* Tech strip */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mr-2">Powered by</span>
            {techStrip.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400" />
                {t}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/10">
            {heroSectionData.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}

export default HeroSection;
