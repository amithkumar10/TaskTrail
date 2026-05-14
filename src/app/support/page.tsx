"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROJECTS = ["Ramnathi", "Wadigo", "Saraswat", "Astrix HR App", "Astrix HR Web"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = [2022, 2023, 2024, 2025];

// Hours per month per project per year (mock)
const mockHours: Record<number, Record<string, number[]>> = {
  2022: {
    Ramnathi:        [12, 8, 15, 10, 6, 18, 9, 14, 11, 7, 16, 13],
    Wadigo:          [5, 7, 4, 9, 11, 6, 8, 5, 10, 7, 3, 6],
    Saraswat:        [20, 14, 18, 22, 16, 24, 19, 21, 17, 15, 23, 20],
    "Astrix HR App": [8, 11, 6, 9, 14, 10, 7, 12, 8, 13, 9, 11],
    "Astrix HR Web": [3, 5, 4, 6, 3, 7, 5, 4, 6, 5, 4, 7],
  },
  2023: {
    Ramnathi:        [10, 13, 9, 16, 12, 20, 14, 11, 17, 9, 15, 18],
    Wadigo:          [6, 4, 8, 5, 12, 9, 7, 10, 6, 8, 5, 9],
    Saraswat:        [18, 22, 15, 25, 19, 28, 21, 24, 18, 20, 26, 22],
    "Astrix HR App": [14, 10, 16, 12, 18, 15, 11, 17, 13, 9, 16, 14],
    "Astrix HR Web": [6, 8, 5, 9, 7, 11, 6, 9, 7, 8, 6, 10],
  },
  2024: {
    Ramnathi:        [14, 10, 18, 12, 8, 22, 16, 13, 19, 11, 17, 20],
    Wadigo:          [7, 5, 9, 6, 13, 10, 8, 11, 7, 9, 6, 10],
    Saraswat:        [22, 16, 20, 28, 18, 30, 24, 26, 20, 22, 28, 25],
    "Astrix HR App": [16, 12, 18, 14, 20, 17, 13, 19, 15, 11, 18, 16],
    "Astrix HR Web": [8, 10, 7, 11, 9, 13, 8, 11, 9, 10, 8, 12],
  },
  2025: {
    Ramnathi:        [16, 12, 20, 14, 9, 25, 18, 15, 0, 0, 0, 0],
    Wadigo:          [8, 6, 10, 7, 14, 12, 9, 0, 0, 0, 0, 0],
    Saraswat:        [24, 18, 22, 30, 20, 32, 26, 0, 0, 0, 0, 0],
    "Astrix HR App": [18, 14, 20, 16, 22, 19, 15, 0, 0, 0, 0, 0],
    "Astrix HR Web": [10, 12, 9, 13, 11, 15, 10, 0, 0, 0, 0, 0],
  },
};

function totalByMonth(year: number): number[] {
  return MONTHS.map((_, i) =>
    PROJECTS.reduce((sum, p) => sum + (mockHours[year][p][i] ?? 0), 0)
  );
}

// ─── Chevron Icon ─────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Custom Select ────────────────────────────────────────────────────────────
function Select<T extends string | number>({
  value, options, onChange, label,
}: {
  value: T; options: T[]; onChange: (v: T) => void; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        {label && <span className="text-slate-400">{label}:</span>}
        <span className="text-slate-800">{value}</span>
        <ChevronDown />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
          {options.map((opt) => (
            <button
              key={String(opt)}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${value === opt ? "text-indigo-600 bg-indigo-50" : "text-slate-600"}`}
            >
              {String(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({
  data, months, barColor, animate,
}: {
  data: number[]; months: string[]; barColor: string; animate: boolean;
}) {
  const max = Math.max(...data, 1);
  const ySteps = 5;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((max / ySteps) * (ySteps - i))
  );

  return (
    <div className="w-full flex gap-3 pt-2">
      {/* Y-axis */}
      <div className="flex flex-col justify-between pb-6 pr-1" style={{ minWidth: 32 }}>
        {yLabels.map((v, i) => (
          <span key={i} className="text-[10px] text-slate-300 font-semibold leading-none text-right">{v}h</span>
        ))}
      </div>

      {/* Bars + labels */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end gap-1.5 relative" style={{ height: 180 }}>
          {/* Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yLabels.map((_, i) => (
              <div key={i} className="w-full border-t border-slate-100" />
            ))}
          </div>

          {data.map((val, i) => {
            const heightPct = max > 0 ? (val / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full group relative">
                {/* Tooltip */}
                {val > 0 && (
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                    <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                      {val}h
                    </div>
                    <div className="w-2 h-1 bg-slate-800 mx-auto" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                  </div>
                )}
                {/* Bar container */}
                <div className="w-full flex items-end h-full">
                  <div
                    className="w-full rounded-t-md transition-all duration-700 ease-out cursor-default"
                    style={{
                      height: animate ? `${heightPct}%` : "0%",
                      background: val === 0 ? "#f1f5f9" : barColor,
                      minHeight: val > 0 ? 3 : 0,
                      transitionDelay: `${i * 45}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-1.5 mt-2">
          {months.map((m) => (
            <div key={m} className="flex-1 text-center text-[10px] text-slate-400 font-semibold">{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Project color map ────────────────────────────────────────────────────────
const PROJECT_COLORS: Record<string, { bg: string; text: string; dot: string; gradient: string }> = {
  Ramnathi:        { bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-400",  gradient: "linear-gradient(180deg,#7c3aed,#a78bfa)" },
  Wadigo:          { bg: "bg-sky-50",     text: "text-sky-600",     dot: "bg-sky-400",     gradient: "linear-gradient(180deg,#0284c7,#38bdf8)" },
  Saraswat:        { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", gradient: "linear-gradient(180deg,#059669,#34d399)" },
  "Astrix HR App": { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400",   gradient: "linear-gradient(180deg,#d97706,#fbbf24)" },
  "Astrix HR Web": { bg: "bg-rose-50",    text: "text-rose-600",    dot: "bg-rose-400",    gradient: "linear-gradient(180deg,#e11d48,#fb7185)" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SupportPage() {
  const [loaded, setLoaded] = useState(false);
  const [chart1Year, setChart1Year] = useState<number>(2025);
  const [chart2Year, setChart2Year] = useState<number>(2025);
  const [chart2Project, setChart2Project] = useState<string>("Ramnathi");
  const [animChart1, setAnimChart1] = useState(false);
  const [animChart2, setAnimChart2] = useState(false);

  useEffect(() => { setTimeout(() => { setLoaded(true); setAnimChart1(true); setAnimChart2(true); }, 80); }, []);

  useEffect(() => { setAnimChart1(false); setTimeout(() => setAnimChart1(true), 40); }, [chart1Year]);
  useEffect(() => { setAnimChart2(false); setTimeout(() => setAnimChart2(true), 40); }, [chart2Year, chart2Project]);

  const chart1Data = totalByMonth(chart1Year);
  const chart2Data = mockHours[chart2Year][chart2Project];
  const chart1Total = chart1Data.reduce((s, v) => s + v, 0);
  const chart2Total = chart2Data.reduce((s, v) => s + v, 0);

  // Per-project yearly totals for summary row
  const summaryData = PROJECTS.map((p) => ({
    project: p,
    hours: mockHours[chart1Year][p].reduce((s, v) => s + v, 0),
  }));

  const activeC = PROJECT_COLORS[chart2Project];

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Support Projects</h1>
            <p className="text-sm text-slate-400 mt-1">Track time spent on support across all active projects.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">AD</div>
          </div>
        </div>

        {/* Project Summary Cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {summaryData.map(({ project, hours }) => {
            const c = PROJECT_COLORS[project];
            return (
              <div
                key={project}
                onClick={() => setChart2Project(project)}
                className={`${c.bg} rounded-2xl px-4 py-3.5 flex flex-col gap-1 border-2 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${chart2Project === project ? "border-current shadow-sm" : "border-transparent"}`}
                style={chart2Project === project ? { borderColor: "currentColor" } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${c.text} opacity-60`}>YTD</span>
                </div>
                <p className="text-xl font-extrabold text-slate-900 leading-none mt-1">{hours}h</p>
                <p className={`text-[11px] font-bold ${c.text} truncate`}>{project}</p>
              </div>
            );
          })}
        </div>

        {/* Chart 1 — All projects combined */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-bold text-slate-800">Monthly Support Hours — All Projects</p>
              <p className="text-xs text-slate-400 mt-0.5">Combined hours across all five support projects</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1">
                <span className="text-xs font-extrabold text-indigo-700">{chart1Total}h</span>
                <span className="text-[10px] text-indigo-400 font-semibold">total</span>
              </div>
              <Select<number> value={chart1Year} options={YEARS} onChange={setChart1Year} label="Year" />
            </div>
          </div>

          <BarChart
            data={chart1Data}
            months={MONTHS}
            barColor="linear-gradient(180deg,#6366f1,#818cf8)"
            animate={animChart1}
          />
        </div>

        {/* Chart 2 — Per project */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-slate-800">Monthly Support Hours — By Project</p>
              <p className="text-xs text-slate-400 mt-0.5">Select a project and year to drill into monthly data</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 border ${activeC.bg} border-slate-100`}>
                <span className={`text-xs font-extrabold ${activeC.text}`}>{chart2Total}h</span>
                <span className="text-[10px] text-slate-400 font-semibold">total</span>
              </div>
              <Select<string> value={chart2Project} options={PROJECTS} onChange={setChart2Project} label="Project" />
              <Select<number> value={chart2Year} options={YEARS} onChange={setChart2Year} label="Year" />
            </div>
          </div>

          {/* Project toggle pills */}
          <div className="flex gap-2 flex-wrap mb-1">
            {PROJECTS.map((p) => {
              const c = PROJECT_COLORS[p];
              const active = p === chart2Project;
              return (
                <button
                  key={p}
                  onClick={() => setChart2Project(p)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-150 ${
                    active
                      ? `${c.bg} ${c.text} border-transparent shadow-sm`
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {p}
                </button>
              );
            })}
          </div>

          <BarChart
            data={chart2Data}
            months={MONTHS}
            barColor={activeC.gradient}
            animate={animChart2}
          />
        </div>

      </main>
    </div>
  );
}