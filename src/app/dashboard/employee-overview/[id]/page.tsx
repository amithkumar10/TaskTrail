"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type MockEmployee = {
  id: string;
  initials: string;
  name: string;
  position: string;
  manager: string;
  projects: string[];
  hours: Record<string, Record<number, number[]>>;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "amith-kumar",
    initials: "AK",
    name: "Amith Kumar",
    position: "Full Stack Intern",
    manager: "Elton Dias",
    projects: ["TaskTrail Software"],
    hours: {
      "TaskTrail Software": {
        2023: [16, 12, 18, 14, 20, 16, 22, 18, 15, 19, 17, 21],
        2024: [18, 14, 22, 16, 20, 24, 18, 21, 17, 19, 22, 20],
        2025: [20, 16, 24, 18, 22, 26, 20, 0, 0, 0, 0, 0],
      },
    },
  },
  {
    id: "amin",
    initials: "AM",
    name: "Amin",
    position: "Flutter Intern",
    manager: "Elton Dias",
    projects: ["Wadigo"],
    hours: {
      Wadigo: {
        2023: [10, 8, 12, 9, 11, 14, 10, 12, 9, 11, 13, 10],
        2024: [12, 10, 15, 11, 13, 16, 12, 14, 11, 13, 15, 12],
        2025: [14, 12, 16, 13, 15, 18, 14, 0, 0, 0, 0, 0],
      },
    },
  },
  {
    id: "akshay",
    initials: "AK",
    name: "Akshay",
    position: "UI Intern",
    manager: "Elton",
    projects: ["Ramanathi"],
    hours: {
      Ramanathi: {
        2023: [8, 6, 10, 7, 9, 12, 8, 10, 7, 9, 11, 8],
        2024: [10, 8, 12, 9, 11, 14, 10, 12, 9, 11, 13, 10],
        2025: [12, 10, 14, 11, 13, 16, 12, 0, 0, 0, 0, 0],
      },
    },
  },
  {
    id: "alzaahid-nadaf",
    initials: "AN",
    name: "Alzaahid Nadaf",
    position: "Fullstack Developer",
    manager: "Simplicio",
    projects: ["Ramnathi", "Saraswat", "Wadigo"],
    hours: {
      Ramnathi: {
        2023: [18, 14, 20, 16, 22, 18, 24, 20, 17, 21, 19, 23],
        2024: [20, 16, 24, 18, 22, 26, 20, 23, 19, 21, 25, 22],
        2025: [22, 18, 26, 20, 24, 28, 22, 0, 0, 0, 0, 0],
      },
      Saraswat: {
        2023: [12, 10, 14, 11, 13, 16, 12, 14, 11, 13, 15, 12],
        2024: [15, 12, 18, 14, 16, 20, 15, 17, 14, 16, 19, 16],
        2025: [17, 14, 20, 16, 18, 22, 17, 0, 0, 0, 0, 0],
      },

      Wadigo: {
        2023: [12, 3, 14, 11, 13, 16, 12, 21, 11, 13, 15, 12],
        2024: [15, 12, 3, 14, 16, 20, 1, 17, 14, 16, 19, 16],
        2025: [17, 14, 20, 13, 18, 2, 17, 0, 0, 0, 0, 0],
      },
    },
  },
];

// ─── Project colours ──────────────────────────────────────────────────────────
const PROJECT_COLORS: Record<string, { bg: string; text: string; dot: string; gradient: string }> = {
  "TaskTrail Software": {
    bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400",
    gradient: "linear-gradient(180deg,#7c3aed,#a78bfa)",
  },
  Wadigo: {
    bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-400",
    gradient: "linear-gradient(180deg,#0284c7,#38bdf8)",
  },
  Ramanathi: {
    bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400",
    gradient: "linear-gradient(180deg,#059669,#34d399)",
  },
  Ramnathi: {
    bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400",
    gradient: "linear-gradient(180deg,#d97706,#fbbf24)",
  },
  Saraswat: {
    bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400",
    gradient: "linear-gradient(180deg,#e11d48,#fb7185)",
  },
};

const DEFAULT_COLOR = {
  bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400",
  gradient: "linear-gradient(180deg,#475569,#94a3b8)",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS  = [2023, 2024, 2025];

// ─── Helper ───────────────────────────────────────────────────────────────────
function findEmployee(id: string): MockEmployee {
  if (!id) return MOCK_EMPLOYEES[0];
  
  const slug = String(id).toLowerCase().trim();
  
  // Try exact ID match first
  let found = MOCK_EMPLOYEES.find((e) => e.id.toLowerCase() === slug);
  if (found) return found;
  
  // Try matching by first name
  found = MOCK_EMPLOYEES.find((e) => 
    e.name.toLowerCase().split(" ")[0] === slug
  );
  if (found) return found;
  
  // Try matching by full name
  found = MOCK_EMPLOYEES.find((e) => 
    e.name.toLowerCase().replace(/\s+/g, "-") === slug ||
    e.name.toLowerCase().replace(/\s+/g, "") === slug
  );
  if (found) return found;
  
  // Try partial match - contains
  found = MOCK_EMPLOYEES.find((e) => 
    e.id.toLowerCase().includes(slug) || 
    slug.includes(e.id.toLowerCase()) ||
    e.name.toLowerCase().includes(slug)
  );
  if (found) return found;
  
  // Index-based fallback (0, 1, 2, 3)
  const numId = parseInt(slug);
  if (!isNaN(numId) && numId >= 0 && numId < MOCK_EMPLOYEES.length) {
    return MOCK_EMPLOYEES[numId];
  }
  
  return MOCK_EMPLOYEES[0];
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────
function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Custom select ────────────────────────────────────────────────────────────
function Select<T extends string | number>({
  value, options, onChange, label,
}: {
  value: T; options: T[]; onChange: (v: T) => void; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        {label && <span className="text-slate-400">{label}:</span>}
        <span className="text-slate-800">{value}</span>
        <Chevron />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[110px]">
          {options.map((opt) => (
            <button
              key={String(opt)}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${
                value === opt ? "text-indigo-600 bg-indigo-50" : "text-slate-600"
              }`}
            >
              {String(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({
  data, animate,
}: {
  data: { label: string; hours: number; gradient: string }[];
  animate: boolean;
}) {
  const max = Math.max(...data.map((d) => d.hours), 1);
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((max / ySteps) * (ySteps - i))
  );

  return (
    <div className="w-full flex gap-3 pt-2">
      {/* Y-axis */}
      <div className="flex flex-col justify-between pb-7 pr-1" style={{ minWidth: 30 }}>
        {yLabels.map((v, i) => (
          <span key={i} className="text-[10px] text-slate-300 font-semibold leading-none text-right">
            {v}h
          </span>
        ))}
      </div>

      {/* Bars + x-labels */}
      <div className="flex-1 flex flex-col">
        <div className="relative flex items-end gap-4" style={{ height: 200 }}>
          {/* Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yLabels.map((_, i) => (
              <div key={i} className="w-full border-t border-slate-100" />
            ))}
          </div>

          {data.map(({ label, hours, gradient }, idx) => {
            const heightPct = (hours / max) * 100;
            return (
              <div key={label} className="flex-1 flex flex-col items-center h-full group relative">
                {/* Tooltip */}
                {hours > 0 && (
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                    <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                      {hours}h
                    </div>
                    <div className="w-2 h-1 bg-slate-800 mx-auto" style={{ clipPath: "polygon(0 0,100% 0,50% 100%)" }} />
                  </div>
                )}
                <div className="w-full flex items-end h-full">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 ease-out"
                    style={{
                      height: animate ? `${heightPct}%` : "0%",
                      background: hours === 0 ? "#f1f5f9" : gradient,
                      minHeight: hours > 0 ? 4 : 0,
                      transitionDelay: `${idx * 80}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-4 mt-2">
          {data.map(({ label }) => (
            <div key={label} className="flex-1 text-center text-[10px] text-slate-400 font-semibold truncate px-0.5">
              {label.length > 10 ? label.slice(0, 9) + "…" : label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ employeeName }: { employeeName: string }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setBodyHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mt-6">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors duration-150 group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${open ? "bg-indigo-600" : "bg-indigo-50"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke={open ? "white" : "#6366f1"}
              strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Detailed Activity</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Logs, timesheets and task breakdown for {employeeName}
            </p>
          </div>
        </div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 ${
          open
            ? "bg-indigo-600 border-indigo-600 text-white"
            : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
        }`}>
          <Chevron open={open} />
        </div>
      </button>

      {/* Animated body */}
      <div style={{ height: bodyHeight, transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" }}>
        <div ref={bodyRef}>
          <div className="border-t border-slate-100 px-6 py-10 flex flex-col items-center justify-center gap-3">
            {/* ── Paste your content component here ── */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={1.5}
                strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Your component goes here</p>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Replace this block with the content you'll share in the next step.
            </p>
            {/* ────────────────────────────────────── */}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeOverviewDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const rawId    = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const employee = findEmployee(rawId);

  // Debug log
  console.log("URL param (rawId):", rawId);
  console.log("Found employee:", employee.name, employee.id);

  const [selectedYear,  setSelectedYear]  = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(4); // default May
  const [animate,       setAnimate]       = useState(false);
  const [loaded,        setLoaded]        = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setLoaded(true); setAnimate(true); }, 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 40);
    return () => clearTimeout(t);
  }, [selectedYear, selectedMonth]);

  const { initials, name, position, manager, projects, hours } = employee;

  // Data for bar chart — one bar per project for selected month + year
  const chartData = projects.map((p) => ({
    label:    p,
    hours:    hours[p]?.[selectedYear]?.[selectedMonth] ?? 0,
    gradient: (PROJECT_COLORS[p] ?? DEFAULT_COLOR).gradient,
  }));

  const totalThisMonth = chartData.reduce((s, d) => s + d.hours, 0);

  // YTD totals for summary cards
  const yearlySummary = projects.map((p) => ({
    project: p,
    total:   (hours[p]?.[selectedYear] ?? []).reduce((s: number, v: number) => s + v, 0),
  }));

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Employee Overview
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{name}</h1>
              <p className="mt-1.5 text-sm text-slate-500">
                {position}&nbsp;&middot;&nbsp;Managed by&nbsp;
                <span className="font-semibold text-slate-700">{manager}</span>
              </p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm shadow-indigo-200 shrink-0">
            {initials}
          </div>
        </div>

        {/* ── Profile card + YTD summary cards ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-5 mb-6">

          {/* Profile */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm col-span-1 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Profile</p>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm shadow-indigo-200">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{position}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Manager</span>
                <span className="text-xs font-semibold text-slate-700">{manager}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Employee ID</span>
                <span className="text-xs font-mono text-slate-500 truncate max-w-[100px]">{rawId || employee.id}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-400 mb-2.5">Projects</p>
              <div className="flex flex-wrap gap-2">
                {projects.length === 0
                  ? <span className="text-xs text-slate-300">No projects</span>
                  : projects.map((p) => {
                      const c = PROJECT_COLORS[p] ?? DEFAULT_COLOR;
                      return (
                        <span key={p} className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                          {p}
                        </span>
                      );
                    })
                }
              </div>
            </div>
          </div>

          {/* YTD cards */}
          <div className="col-span-2 grid grid-cols-2 gap-4 content-start">
            {yearlySummary.map(({ project, total }) => {
              const c = PROJECT_COLORS[project] ?? DEFAULT_COLOR;
              return (
                <div key={project} className={`${c.bg} rounded-2xl p-5 flex flex-col gap-2`}>
                  <div className="flex items-center justify-between">
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${c.text} opacity-60`}>
                      {selectedYear} YTD
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{total}h</p>
                  <p className={`text-xs font-bold ${c.text}`}>{project}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Hours by Project chart ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-slate-800">Hours by Project</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Time logged per project for&nbsp;
                <span className="font-semibold text-slate-600">
                  {MONTHS[selectedMonth]} {selectedYear}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {totalThisMonth > 0 && (
                <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1">
                  <span className="text-xs font-extrabold text-indigo-700">{totalThisMonth}h</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">this month</span>
                </div>
              )}
              <Select<number> value={selectedYear} options={YEARS} onChange={setSelectedYear} label="Year" />
            </div>
          </div>

          {/* Month selector pills */}
          <div className="flex gap-1.5 flex-wrap mb-2">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(i)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-150 ${
                  selectedMonth === i
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Chart */}
          <BarChart data={chartData} animate={animate} />

          {/* Breakdown chips */}
          <div className="flex gap-3 mt-5 pt-4 border-t border-slate-50 flex-wrap">
            {chartData.map(({ label, hours: h }) => {
              const c = PROJECT_COLORS[label] ?? DEFAULT_COLOR;
              return (
                <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${c.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-xs font-bold ${c.text}`}>{label}</span>
                  <span className="text-xs text-slate-500 font-semibold">{h}h</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Accordion ──────────────────────────────────────────────────── */}
        <Accordion employeeName={name} />

      </main>
    </div>
  );
}