import React, { useEffect, useState } from 'react';
import { clientApi } from '../clientApi/ClientApi';

const VERSION = import.meta.env.VITE_API_VERSION;

// Colour theme derived from suitability score + accessibility
const themeFor = (score, recommended) => {
  if (!recommended || score < 45)
    return { border: 'border-red-200', bg: 'bg-red-50', bar: 'bg-red-500', text: 'text-red-700', chip: 'bg-red-100 text-red-700', icon: 'text-red-500' };
  if (score >= 75)
    return { border: 'border-emerald-200', bg: 'bg-emerald-50', bar: 'bg-emerald-500', text: 'text-emerald-700', chip: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500' };
  if (score >= 60)
    return { border: 'border-lime-200', bg: 'bg-lime-50', bar: 'bg-lime-500', text: 'text-lime-700', chip: 'bg-lime-100 text-lime-700', icon: 'text-lime-600' };
  return { border: 'border-amber-200', bg: 'bg-amber-50', bar: 'bg-amber-500', text: 'text-amber-700', chip: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' };
};

export default function ClimateCheck({ destination, month }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!destination || !month) { setResult(null); return; }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const resp = await clientApi.post(`api${VERSION}/ai-analysis/climate-suitability`, { destination, month });
      if (cancelled) return;
      setLoading(false);
      setResult(resp?.ok ? resp.data : null);
    }, 500);
    return () => { cancelled = true; clearTimeout(t); };
  }, [destination, month]);

  if (!destination || !month) return null;

  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <svg className="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Checking climate for <span className="font-semibold text-slate-700">{destination}</span> in {month}…
      </div>
    );
  }

  if (!result) return null;

  if (!result.matched) {
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        No seasonal climate profile for <span className="font-semibold text-slate-700">{destination}</span> yet — we'll rely on the live forecast for this trip.
      </div>
    );
  }

  const t = themeFor(result.suitability_score, result.is_recommended);

  return (
    <div className={`mt-2 rounded-2xl border ${t.border} ${t.bg} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <svg className={`w-5 h-5 ${t.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <div>
            <p className="text-sm font-bold text-slate-800 font-display capitalize">
              {result.destination} · {result.month}
            </p>
            <p className={`text-xs font-semibold ${t.text}`}>{result.verdict} time to visit · {result.condition}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${t.chip}`}>
          {result.suitability_score}/100
        </span>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-2 w-full rounded-full bg-white/70 overflow-hidden">
        <div className={`h-full rounded-full ${t.bar} transition-all duration-500`} style={{ width: `${result.suitability_score}%` }} />
      </div>

      {/* Details */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
        <span>🌡️ {result.avg_low_c}° – {result.avg_high_c}°C</span>
        {result.best_months?.length > 0 && (
          <span>📅 Best months: <span className="font-semibold text-slate-700">{result.best_months.join(', ')}</span></span>
        )}
      </div>

      <p className={`mt-2 text-xs ${t.text}`}>{result.recommendation}</p>

      {!result.is_recommended && result.best_months?.length > 0 && (
        <p className="mt-2 text-xs font-semibold text-red-700">
          ⚠️ Consider travelling in {result.best_months[0]} instead for a much better experience.
        </p>
      )}
    </div>
  );
}
