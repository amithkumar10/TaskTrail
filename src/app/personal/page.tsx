"use client";

import React, { useState, useEffect, useRef } from "react";
import AttendanceSelector from "@/components/personal/AttendanceSelector";


// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT — change this one line to switch the entire task flow
// "Development" | "Social Media" | "Marketing"
// ─────────────────────────────────────────────────────────────────────────────
const CURRENT_DEPARTMENT:string = "Marketing";

// ─── Department Config ────────────────────────────────────────────────────────
const DEPT_CONFIG = {
  "Development Team": {
    projects: [
      { name: "Ramnathi", modules: ["User Auth", "Dashboard", "Reports", "Payments"] },
      { name: "Wadigo",   modules: ["Home Screen"] }, // single → auto-selected
      { name: "Saraswat", modules: ["API Integration", "Frontend UI"] },
    ],
    types: ["Support", "Ongoing"],
    moduleType: "Ongoing", // modules only shown when this type is selected
  },
  "Social Media": {
    projects: [
      { name: "Damodar" },
      { name: "VVA" },
      { name: "Astrix" },
    ],
    types: ["Reels", "Posts"],
    moduleType: null,
  },
  Marketing: {
    projects: [
      { name: "Zawk" },
      { name: "Love Diamonds" },
      { name: "Bloom" },
    ],
    types: ["UI", "Video Generation", "Image Generation"],
    moduleType: null,
  },
} as const;

type DeptKey = keyof typeof DEPT_CONFIG;
const config = DEPT_CONFIG[CURRENT_DEPARTMENT as DeptKey] as any;

// ─── Time options ─────────────────────────────────────────────────────────────
const HOUR_OPTIONS = Array.from({ length: 9 }, (_, i) => `${i}h`);
const MIN_OPTIONS  = ["0m", "15m", "30m", "45m"];

// ─── Types ────────────────────────────────────────────────────────────────────
type Task = {
  id: string;
  project: string;
  type: string;
  module?: string;
  hours: number;
  minutes: number;
  description: string;
};

// ─── Mock seed tasks ──────────────────────────────────────────────────────────
const MOCK_TASKS: Task[] = [
  {
    id: "1", project: "Ramnathi", type: "Support",
    hours: 2, minutes: 30, description: "Fixed broken login redirect",
  },
  {
    id: "2", project: "Wadigo", type: "Ongoing", module: "Home Screen",
    hours: 1, minutes: 15, description: "Built new listing cards",
  },
];

// ─── Project colours ──────────────────────────────────────────────────────────
const PROJECT_COLORS: Record<string, { pill: string; dot: string; iconBg: string }> = {
  Ramnathi:       { pill: "bg-violet-50 text-violet-700",  dot: "bg-violet-400",  iconBg: "bg-violet-100" },
  Wadigo:         { pill: "bg-sky-50 text-sky-700",        dot: "bg-sky-400",     iconBg: "bg-sky-100"    },
  Saraswat:       { pill: "bg-emerald-50 text-emerald-700",dot: "bg-emerald-400", iconBg: "bg-emerald-100"},
  Damodar:        { pill: "bg-amber-50 text-amber-700",    dot: "bg-amber-400",   iconBg: "bg-amber-100"  },
  VVA:            { pill: "bg-rose-50 text-rose-700",      dot: "bg-rose-400",    iconBg: "bg-rose-100"   },
  Astrix:         { pill: "bg-indigo-50 text-indigo-700",  dot: "bg-indigo-400",  iconBg: "bg-indigo-100" },
  Zawk:           { pill: "bg-teal-50 text-teal-700",      dot: "bg-teal-400",    iconBg: "bg-teal-100"   },
  "Love Diamonds":{ pill: "bg-pink-50 text-pink-700",      dot: "bg-pink-400",    iconBg: "bg-pink-100"   },
  Bloom:          { pill: "bg-orange-50 text-orange-700",  dot: "bg-orange-400",  iconBg: "bg-orange-100" },
};
const DEFAULT_COLOR = { pill: "bg-slate-50 text-slate-600", dot: "bg-slate-300", iconBg: "bg-slate-100" };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ClipboardList: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
};

// ─── Step Pill Dropdown ───────────────────────────────────────────────────────
function StepPill({
  value, placeholder, options, onSelect, locked,
}: {
  value: string; placeholder: string; options: string[];
  onSelect: (v: string) => void; locked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isSet = !!value;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !locked && setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all select-none ${
          locked
            ? "bg-indigo-600 text-white border-indigo-600 cursor-default"
            : isSet
            ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
            : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600"
        }`}
      >
        <span>{value || placeholder}</span>
        {!locked && (
          <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ml-1`}>
            <Icons.ChevronDown />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-2 min-w-[180px] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onSelect(opt); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm font-semibold transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${
                value === opt ? "text-indigo-700 bg-indigo-50" : "text-slate-700"
              }`}
            >
              {opt}
              {value === opt && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Thin arrow separator
const Arrow = () => (
  <span className="text-slate-300">
    <Icons.ChevronRight />
  </span>
);

// ─── Task Builder ─────────────────────────────────────────────────────────────
function TaskBuilder({ onAdd }: { onAdd: (t: Omit<Task, "id">) => void }) {
  const [active,  setActive]  = useState(false);
  const [project, setProject] = useState("");
  const [type,    setType]    = useState("");
  const [module,  setModule]  = useState("");
  const [hours,   setHours]   = useState("");
  const [mins,    setMins]    = useState("");
  const [desc,    setDesc]    = useState("");

  const selectedProj  = config.projects.find((p: any) => p.name === project);
  const isDev         = CURRENT_DEPARTMENT === "Development Team";
  // show module selection when this department's config defines a moduleType
  // and the selected type matches (case-insensitive) and the project has modules
  const needsModule = !!config.moduleType
    && typeof type === "string"
    && type.trim().toLowerCase() === String(config.moduleType).trim().toLowerCase()
    && !!selectedProj
    && Array.isArray(selectedProj.modules)
    && selectedProj.modules.length > 0;
  const autoModule    = needsModule && selectedProj?.modules?.length === 1
    ? selectedProj.modules[0] : null;
  const showModulePill = needsModule && !autoModule;

  const s1Done = !!project;
  const s2Done = s1Done && !!type;
  const s3Done = s2Done && (!showModulePill || !!module);
  const s4Done = s3Done && hours !== "" && mins !== "";
  const canAdd = s4Done;

  const reset = () => {
    setActive(false); setProject(""); setType(""); setModule("");
    setHours(""); setMins(""); setDesc("");
  };

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      project, type,
      module:      autoModule || module || undefined,
      hours:       parseInt(hours),
      minutes:     parseInt(mins),
      description: desc,
    });
    reset();
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-xs font-semibold text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/40 transition-all group"
      >
        <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
          <Icons.Plus />
        </div>
        Log Completed Task
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 flex flex-col gap-3">

      {/* ── Pill chain ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Project */}
        <StepPill
          value={project} placeholder="Project"
          options={config.projects.map((p: any) => p.name)}
          onSelect={(v) => { setProject(v); setType(""); setModule(""); setHours(""); setMins(""); }}
        />

        {/* Type */}
        {s1Done && (
          <>
            <Arrow />
            <StepPill
              value={type} placeholder="Type"
              options={[...config.types]}
              onSelect={(v) => { setType(v); setModule(""); setHours(""); setMins(""); }}
            />
          </>
        )}

        {/* Module (Dev + Ongoing + multiple modules) */}
        {s2Done && showModulePill && (
          <>
            <Arrow />
            <StepPill
              value={module} placeholder="Module"
              options={selectedProj?.modules || []}
              onSelect={(v) => { setModule(v); setHours(""); setMins(""); }}
            />
          </>
        )}

        {/* Auto-selected module */}
        {s2Done && autoModule && (
          <>
            <Arrow />
            <StepPill value={autoModule} placeholder="" options={[]} onSelect={() => {}} locked />
          </>
        )}

        {/* Hours */}
        {s3Done && (
          <>
            <Arrow />
            <StepPill
              value={hours ? `${hours}h` : ""} placeholder="Hrs"
              options={HOUR_OPTIONS}
              onSelect={(v) => setHours(v.replace("h", ""))}
            />
          </>
        )}

        {/* Minutes */}
        {s3Done && (
          <>
            <span className="text-slate-300 text-xs font-bold">:</span>
            <StepPill
              value={mins !== "" ? `${mins}m` : ""} placeholder="Mins"
              options={MIN_OPTIONS}
              onSelect={(v) => setMins(v.replace("m", ""))}
            />
          </>
        )}
      </div>

      {/* Progress hint */}
      {!canAdd && (
        <p className="text-[10px] text-slate-400 font-medium">
          {!s1Done ? "↑ Pick a project to begin"
            : !s2Done ? "↑ Select a type"
            : !s3Done ? "↑ Select a module"
            : "↑ Choose hours and minutes"}
        </p>
      )}

      {/* Description input */}
      {s4Done && (
        <input
          autoFocus
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="Brief description of what you did (optional)…"
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 placeholder:text-slate-400 text-slate-700 transition-all"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button" onClick={reset}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        {canAdd && (
          <button
            type="button" onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
          >
            <Icons.Check />
            Log Task
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onRemove }: { task: Task; onRemove: () => void }) {
  const c       = PROJECT_COLORS[task.project] || DEFAULT_COLOR;
  const timeStr = task.hours > 0 && task.minutes > 0
    ? `${task.hours}h ${task.minutes}m`
    : task.hours > 0 ? `${task.hours}h` : `${task.minutes}m`;

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm group">

      {/* Done indicator */}
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-200">
        <Icons.Check />
      </div>

      <div className="flex-1 min-w-0">
        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project pill */}
          <span className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full ${c.pill}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
            {task.project}
          </span>

          {/* Type */}
          <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {task.type}
          </span>

          {/* Module */}
          {task.module && (
            <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {task.module}
            </span>
          )}

          {/* Time — pushed right */}
          <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
            <Icons.Clock />
            {timeStr}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{task.description}</p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
      >
        <Icons.X />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PersonalPage() {
  const [letter, setLetter] = useState("U");
  const [tasks,  setTasks]  = useState<Task[]>(MOCK_TASKS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const word = localStorage.getItem("username")
      ? JSON.parse(localStorage.getItem("username")!)[0].toUpperCase()
      : "U";
    setLetter(word);
    setTimeout(() => setLoaded(true), 60);
  }, []);

  // Temporarily opt this route out of global `.dark` while mounted
  useEffect(() => {
    if (typeof document === "undefined") return;
    const hadDark = document.documentElement.classList.contains("dark");
    if (hadDark) document.documentElement.classList.remove("dark");
    return () => {
      if (hadDark) document.documentElement.classList.add("dark");
    };
  }, []);

  const handleAdd = (t: Omit<Task, "id">) => {
    setTasks((prev) => [{ ...t, id: Date.now().toString() }, ...prev]);
  };

  const handleRemove = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const totalHours   = tasks.reduce((s, t) => s + t.hours + t.minutes / 60, 0);
  const displayHours = Math.floor(totalHours);
  const displayMins  = Math.round((totalHours - displayHours) * 60);

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex overflow-x-hidden transition-all duration-500 force-light ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
    

      <main className="ml-0 md:ml-56 flex-1 px-4 md:px-8 py-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Personal</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">My Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              &nbsp;·&nbsp;
              <span className="font-semibold text-slate-600">{CURRENT_DEPARTMENT}</span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
           
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">
              {letter}
            </div>
          </div>
        </div>

        {/* ── Content row ───────────────────────────────────────────────── */}
        {/* ── Content row ───────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Left column: Attendance */}
          <div className="w-full md:shrink-0 md:w-auto">
            <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <AttendanceSelector />
            </div>
          </div>

          {/* Right column: Task log */}
          <div className="flex-1 min-w-0 flex flex-col gap-5 w-full">

          

            {/* Task log card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icons.ClipboardList />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Today's Work Log</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tasks.length === 0
                        ? "No tasks logged yet"
                        : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} completed`}
                    </p>
                  </div>
                </div>
              </div>

              {/* List + builder */}
              <div className="p-4 flex flex-col gap-2.5">

                {/* Builder */}
                <TaskBuilder onAdd={handleAdd} />

                {/* Empty state */}
                {tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Icons.ClipboardList />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">Nothing logged yet</p>
                    <p className="text-xs mt-1 text-slate-400">Log your completed work using the button above.</p>
                  </div>
                )}

                {/* Task cards */}
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onRemove={() => handleRemove(task.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}