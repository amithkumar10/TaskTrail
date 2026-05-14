"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModuleStatus = "not_started" | "ongoing" | "support" | "completed";

interface Module {
  name: string;
  status: ModuleStatus;
  startDate?: string;
  endDate?: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  modules: Module[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    _id: "1",
    name: "Ramnathi",
    description: "Core platform for managing real-estate workflows and property records.",
    modules: [
      { name: "User Auth", status: "completed", startDate: "2024-01-10", endDate: "2024-02-15" },
      { name: "Dashboard", status: "support", startDate: "2024-02-20" },
      { name: "Reporting Engine", status: "ongoing", startDate: "2024-04-01" },
      { name: "Notifications", status: "ongoing", startDate: "2024-05-15" },
    ],
  },
  {
    _id: "2",
    name: "Wadigo",
    description: "Logistics and route-optimisation tool for last-mile delivery teams.",
    modules: [
      { name: "Route Planner", status: "ongoing", startDate: "2024-03-01" },
      { name: "Driver App", status: "not_started" },
      { name: "Analytics", status: "not_started" },
    ],
  },
  {
    _id: "3",
    name: "Saraswat",
    description: "Banking & finance portal for cooperative credit societies.",
    modules: [
      { name: "Core Banking", status: "completed", startDate: "2023-06-01", endDate: "2023-12-31" },
      { name: "Loan Module", status: "completed", startDate: "2024-01-01", endDate: "2024-03-30" },
      { name: "Customer Support Portal", status: "support", startDate: "2024-04-01" },
      { name: "Mobile App", status: "support", startDate: "2024-05-01" },
    ],
  },
  {
    _id: "4",
    name: "Astrix HR App",
    description: "Mobile HR application for employee self-service and payroll.",
    modules: [
      { name: "Attendance", status: "ongoing", startDate: "2024-02-01" },
      { name: "Leave Management", status: "ongoing", startDate: "2024-03-01" },
      { name: "Payroll", status: "not_started" },
    ],
  },
  {
    _id: "5",
    name: "Astrix HR Web",
    description: "Web-based HR management console for administrators.",
    modules: [
      { name: "Employee Records", status: "completed", startDate: "2023-09-01", endDate: "2024-01-31" },
      { name: "Recruitment", status: "ongoing", startDate: "2024-02-01" },
      { name: "Performance Review", status: "not_started" },
      { name: "Reports", status: "not_started" },
    ],
  },
];

// ─── Status config ─────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ModuleStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
  not_started: { label: "Not Started", bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400",   border: "border-slate-200"  },
  ongoing:     { label: "Ongoing",     bg: "bg-amber-50",    text: "text-amber-600",   dot: "bg-amber-400",   border: "border-amber-200"  },
  support:     { label: "Support",     bg: "bg-sky-50",      text: "text-sky-600",     dot: "bg-sky-400",     border: "border-sky-200"    },
  completed:   { label: "Completed",   bg: "bg-emerald-50",  text: "text-emerald-600", dot: "bg-emerald-400", border: "border-emerald-200"},
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Headphones: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
};

// ─── Mini Calendar ────────────────────────────────────────────────────────────
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function MiniCalendar({ value, onChange, onClose }: {
  value: string; onChange: (d: string) => void; onClose: () => void;
}) {
  const today = new Date();
  const initDate = value ? new Date(value + "T00:00:00") : today;
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const isSelected = (d: number) =>
    selectedDate &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === d;

  const isToday = (d: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === d;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const pick = (d: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute z-30 top-full mt-2 left-0 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 p-3 w-64 select-none"
    >
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Icons.ChevronLeft />
        </button>
        <span className="text-xs font-bold text-slate-800">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Icons.ChevronRight />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <button
                onClick={() => pick(d)}
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-colors
                  ${isSelected(d) ? "bg-indigo-600 text-white" :
                    isToday(d) ? "bg-indigo-50 text-indigo-600 font-bold" :
                    "text-slate-700 hover:bg-slate-100"}`}
              >
                {d}
              </button>
            ) : <div className="w-7 h-7" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Date Field ───────────────────────────────────────────────────────────────
function DateField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const fmt = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${day} ${MONTH_NAMES[parseInt(m) - 1]?.slice(0,3)} ${y}`;
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-left hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-50 transition-all"
      >
        <span className="text-slate-400"><Icons.Calendar /></span>
        <span className={`text-xs font-semibold flex-1 ${value ? "text-slate-800" : "text-slate-400"}`}>
          {value ? fmt(value) : `Select ${label.toLowerCase()}`}
        </span>
        {value && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="text-slate-300 hover:text-rose-400 transition-colors"
          >
            <Icons.X />
          </span>
        )}
      </button>
      {open && (
        <MiniCalendar value={value} onChange={onChange} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

// ─── Module Panel ─────────────────────────────────────────────────────────────
function ModulePanel({ module, open, onClose, onSave }: {
  module: Module | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Module) => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [status, setStatus]       = useState<ModuleStatus>("not_started");

  useEffect(() => {
    if (module) {
      setStartDate(module.startDate || "");
      setEndDate(module.endDate || "");
      setStatus(module.status);
    }
  }, [module]);

  const handleSave = () => {
    if (!module) return;
    onSave({ ...module, startDate, endDate, status });
    onClose();
  };

  if (!module) return null;

  const cfg = STATUS_CONFIG[status];

  // Toggle: ongoing ↔ support
  const toggleWorkStatus = () => {
    if (status === "ongoing") setStatus("support");
    else if (status === "support") setStatus("ongoing");
    else if (status === "not_started") setStatus("ongoing");
    else setStatus("ongoing"); // from completed, go back to ongoing
  };

  // Toggle: completed ↔ (keep current active status)
  const toggleCompleted = () => {
    if (status === "completed") setStatus("ongoing");
    else setStatus("completed");
  };

  const isCompleted = status === "completed";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Panel */}
      <aside className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl shadow-slate-900/10 z-50 flex flex-col transition-all duration-300 ease-out ${open ? "translate-x-0 visible" : "translate-x-full invisible"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icons.Layers />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[260px]">{module.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Edit module details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Icons.X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {/* Current status display */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-500">Current Status</p>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border} w-fit`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
            </div>
          </div>

          {/* Status toggles */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-slate-500">Change Status</p>

            {/* Ongoing ↔ Support toggle */}
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Work Phase</p>
              <div className="flex gap-2">
                {(["ongoing","support"] as ModuleStatus[]).map((s) => {
                  const c = STATUS_CONFIG[s];
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => !isCompleted && setStatus(s)}
                      disabled={isCompleted}
                      className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        active
                          ? `${c.bg} ${c.text} ${c.border} shadow-sm`
                          : isCompleted
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? c.dot : "bg-slate-300"}`} />
                      {c.label}
                      {active && <span className="ml-auto text-current"><Icons.Check /></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Not started option */}
            {(status === "not_started" || status === "ongoing" || status === "support") && (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Or reset to</p>
                <button
                  type="button"
                  onClick={() => setStatus("not_started")}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all w-full ${
                    status === "not_started"
                      ? "bg-slate-100 text-slate-600 border-slate-300 shadow-sm"
                      : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Not Started
                  {status === "not_started" && <span className="ml-auto"><Icons.Check /></span>}
                </button>
              </div>
            )}

            {/* Completed divider toggle */}
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completion</p>
              <button
                type="button"
                onClick={toggleCompleted}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold transition-all w-full ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/40"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                }`}>
                  {isCompleted && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                      <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>{isCompleted ? "Marked as Completed" : "Mark as Completed"}</span>
                {isCompleted && <span className="ml-auto text-[10px] font-bold text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full">Done</span>}
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-slate-500">Timeline</p>
            <DateField label="Start Date" value={startDate} onChange={setStartDate} />
            <DateField label="End Date"   value={endDate}   onChange={setEndDate}   />
          </div>

          {/* Date summary pill */}
          {(startDate || endDate) && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Icons.Calendar />
              <span className="text-xs text-slate-500 font-medium">
                {startDate && !endDate && `Starting ${fmt(startDate)}`}
                {!startDate && endDate && `Ending ${fmt(endDate)}`}
                {startDate && endDate && `${fmt(startDate)} → ${fmt(endDate)}`}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors">
            <Icons.Save />
            Save Changes
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day} ${MONTH_NAMES[parseInt(m) - 1]?.slice(0, 3)} ${y}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params?.id as string;

  const [projects, setProjects]         = useState<Project[]>(MOCK_PROJECTS);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedIndex, setSelectedIndex]   = useState<number | null>(null);
  const [panelOpen, setPanelOpen]           = useState(false);
  const [loaded, setLoaded]                 = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  const project = projects.find((p) => p._id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-slate-800">Project not found</p>
          <p className="text-slate-400 mt-2 text-sm">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const openModule = (mod: Module, idx: number) => {
    setSelectedModule(mod);
    setSelectedIndex(idx);
    setPanelOpen(true);
  };

  const handleSave = (updated: Module) => {
    if (selectedIndex === null) return;
    setProjects(prev =>
      prev.map(p => {
        if (p._id !== id) return p;
        const newModules = [...p.modules];
        newModules[selectedIndex] = updated;
        return { ...p, modules: newModules };
      })
    );
    setPanelOpen(false);
  };

  // Stats
  const total      = project.modules.length;
  const completed  = project.modules.filter(m => m.status === "completed").length;
  const ongoing    = project.modules.filter(m => m.status === "ongoing").length;
  const support    = project.modules.filter(m => m.status === "support").length;
  const notStarted = project.modules.filter(m => m.status === "not_started").length;
  const progress   = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex overflow-x-hidden transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8 overflow-x-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Icons.ArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
              <p className="text-sm text-slate-400 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm hover:bg-slate-50 transition-colors">
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">AD</div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Modules",  value: total,      color: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-400"  },
            { label: "Completed",      value: completed,  color: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
            { label: "Ongoing",        value: ongoing,    color: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400"   },
            { label: "Support",        value: support,    color: "bg-sky-50",     text: "text-sky-600",     dot: "bg-sky-400"     },
            { label: "Not Started",    value: notStarted, color: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
          ].map(({ label, value, color, text, dot }) => (
            <div key={label} className={`${color} rounded-2xl px-4 py-3.5 flex flex-col gap-1`}>
              <div className="flex items-center justify-between">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${text} opacity-60`}>stat</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 leading-none mt-1">{value}</p>
              <p className={`text-[11px] font-bold ${text}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-800">Overall Progress</p>
            <span className="text-sm font-extrabold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out"
              style={{ width: loaded ? `${progress}%` : "0%" }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{completed} of {total} modules completed</p>
        </div>

        {/* Modules list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.Layers />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Modules</p>
                <p className="text-xs text-slate-400 mt-0.5">Click a module to edit its details</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">{total} total</span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[2.5fr_1.2fr_1.5fr_1.5fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
            {["Module Name", "Status", "Start Date", "End Date"].map(h => (
              <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <ul className="divide-y divide-slate-50">
            {project.modules.map((mod, idx) => {
              const cfg = STATUS_CONFIG[mod.status];
              return (
                <li
                  key={mod.name + idx}
                  onClick={() => openModule(mod, idx)}
                  className="grid grid-cols-[2.5fr_1.2fr_1.5fr_1.5fr] gap-4 items-center px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <span className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{mod.name}</span>
                  </div>

                  {/* Status badge */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {mod.status === "ongoing"   && <Icons.Zap />}
                      {mod.status === "support"   && <Icons.Headphones />}
                      {mod.status === "completed" && <Icons.Check />}
                      {cfg.label}
                    </span>
                  </div>

                  {/* Start date */}
                  <span className="text-xs font-medium text-slate-500">
                    {mod.startDate ? fmt(mod.startDate) : <span className="text-slate-300">—</span>}
                  </span>

                  {/* End date */}
                  <span className="text-xs font-medium text-slate-500">
                    {mod.endDate ? fmt(mod.endDate) : <span className="text-slate-300">—</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      {/* Module edit panel */}
      <ModulePanel
        module={selectedModule}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}