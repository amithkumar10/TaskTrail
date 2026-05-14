"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModuleStatus = "completed" | "ongoing" | "not_started";

interface Module {
  name: string;
  status: ModuleStatus;
  deadline?: string; // only for ongoing
}

interface Employee {
  id: string;
  name: string;
  position: string;
  // hours[year][month_index]
  hours: Record<number, number[]>;
}

interface ProjectData {
  id: string;
  name: string;
  lead: string;
  category: string;
  startDate: string;
  modules: Module[];
  employees: Employee[];
  // overall project hours[year][month_index]
  monthlyHours: Record<number, number[]>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Record<string, ProjectData> = {
  "1": {
    id: "1",
    name: "Ramanthi",
    lead: "Arjun Desai",
    category: "Internal Tool",
    startDate: "Jan 2023",
    modules: [
      { name: "User Authentication", status: "completed" },
      { name: "Dashboard", status: "completed" },
      { name: "Reporting Engine", status: "ongoing", deadline: "Aug 2025" },
      { name: "Push Notifications", status: "ongoing", deadline: "Sep 2025" },
      { name: "Admin Panel", status: "not_started" },
    ],
    employees: [
      {
        id: "e1", name: "Priya Nair", position: "Frontend Dev",
        hours: {
          2024: [12, 10, 14, 8, 16, 18, 12, 14, 10, 8, 12, 16],
          2025: [14, 12, 16, 10, 18, 20, 15, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e2", name: "Rohan Mehta", position: "Backend Dev",
        hours: {
          2024: [18, 14, 20, 16, 22, 18, 20, 16, 18, 14, 20, 22],
          2025: [20, 16, 22, 18, 24, 20, 18, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e3", name: "Sneha Kulkarni", position: "UI/UX Designer",
        hours: {
          2024: [8, 6, 10, 8, 12, 10, 8, 10, 6, 8, 10, 12],
          2025: [10, 8, 12, 10, 14, 12, 8, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e4", name: "Vikram Shah", position: "QA Engineer",
        hours: {
          2024: [6, 8, 6, 10, 8, 12, 8, 10, 8, 6, 8, 10],
          2025: [8, 10, 8, 12, 10, 14, 10, 0, 0, 0, 0, 0],
        },
      },
    ],
    monthlyHours: {
      2023: [30, 24, 36, 28, 20, 40, 32, 38, 26, 22, 34, 30],
      2024: [44, 38, 50, 42, 58, 58, 48, 50, 42, 36, 50, 60],
      2025: [52, 46, 58, 50, 66, 66, 51, 0, 0, 0, 0, 0],
    },
  },
  "2": {
    id: "2",
    name: "Edulex",
    lead: "Meera Joshi",
    category: "EdTech Platform",
    startDate: "Mar 2023",
    modules: [
      { name: "Course Builder", status: "ongoing", deadline: "Oct 2025" },
      { name: "Student Portal", status: "ongoing", deadline: "Nov 2025" },
      { name: "Payment Gateway", status: "completed" },
      { name: "Analytics Dashboard", status: "completed" },
      { name: "Mobile Application", status: "not_started" },
      { name: "Live Streaming", status: "not_started" },
    ],
    employees: [
      {
        id: "e5", name: "Ananya Krishnan", position: "Full Stack Dev",
        hours: {
          2024: [20, 16, 22, 18, 24, 22, 20, 18, 22, 16, 20, 24],
          2025: [22, 18, 24, 20, 26, 24, 22, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e6", name: "Ravi Pillai", position: "Backend Dev",
        hours: {
          2024: [14, 12, 16, 14, 18, 16, 14, 12, 16, 14, 18, 20],
          2025: [16, 14, 18, 16, 20, 18, 16, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e7", name: "Divya Shetty", position: "Product Designer",
        hours: {
          2024: [10, 8, 12, 10, 14, 12, 10, 8, 12, 10, 14, 16],
          2025: [12, 10, 14, 12, 16, 14, 12, 0, 0, 0, 0, 0],
        },
      },
    ],
    monthlyHours: {
      2023: [20, 16, 28, 22, 32, 28, 24, 30, 20, 18, 28, 32],
      2024: [44, 36, 50, 42, 56, 50, 44, 38, 50, 40, 52, 60],
      2025: [50, 42, 56, 48, 62, 56, 50, 0, 0, 0, 0, 0],
    },
  },
  "3": {
    id: "3",
    name: "Saraswat",
    lead: "Suresh Patil",
    category: "Banking Software",
    startDate: "Jun 2022",
    modules: [
      { name: "Core Banking Module", status: "completed" },
      { name: "Loan Processing", status: "completed" },
      { name: "Customer Support Portal", status: "ongoing", deadline: "Dec 2025" },
      { name: "Mobile Banking", status: "ongoing", deadline: "Jan 2026" },
      { name: "Investment Module", status: "not_started" },
    ],
    employees: [
      {
        id: "e8", name: "Kavita Rao", position: "Senior Dev",
        hours: {
          2024: [24, 20, 28, 22, 30, 26, 24, 20, 28, 22, 30, 32],
          2025: [26, 22, 30, 24, 32, 28, 26, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e9", name: "Nikhil Jain", position: "Backend Dev",
        hours: {
          2024: [16, 14, 18, 16, 20, 18, 16, 14, 18, 16, 20, 22],
          2025: [18, 16, 20, 18, 22, 20, 18, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e10", name: "Pooja Iyer", position: "QA Lead",
        hours: {
          2024: [10, 12, 10, 14, 12, 16, 12, 14, 10, 12, 14, 16],
          2025: [12, 14, 12, 16, 14, 18, 14, 0, 0, 0, 0, 0],
        },
      },
    ],
    monthlyHours: {
      2022: [30, 26, 34, 28, 36, 32, 28, 34, 26, 28, 36, 38],
      2023: [40, 34, 44, 38, 48, 44, 38, 44, 36, 38, 46, 50],
      2024: [50, 46, 56, 52, 62, 60, 52, 48, 56, 50, 64, 70],
      2025: [56, 52, 62, 58, 68, 66, 58, 0, 0, 0, 0, 0],
    },
  },
  "4": {
    id: "4",
    name: "Doctors Desk",
    lead: "Dr. Amit Verma",
    category: "Healthcare SaaS",
    startDate: "Sep 2024",
    modules: [
      { name: "Appointment Scheduler", status: "ongoing", deadline: "Aug 2025" },
      { name: "Patient Records", status: "ongoing", deadline: "Oct 2025" },
      { name: "Billing & Invoicing", status: "completed" },
      { name: "Lab Integration", status: "ongoing", deadline: "Dec 2025" },
      { name: "Telemedicine Module", status: "not_started" },
      { name: "Pharmacy Management", status: "not_started" },
    ],
    employees: [
      {
        id: "e11", name: "Aditi Sharma", position: "Full Stack Dev",
        hours: {
          2024: [0, 0, 0, 0, 0, 0, 0, 0, 18, 16, 20, 22],
          2025: [20, 18, 24, 20, 26, 22, 20, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e12", name: "Karan Malhotra", position: "Backend Dev",
        hours: {
          2024: [0, 0, 0, 0, 0, 0, 0, 0, 14, 12, 16, 18],
          2025: [16, 14, 20, 16, 22, 18, 16, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e13", name: "Lakshmi Nambiar", position: "UI Designer",
        hours: {
          2024: [0, 0, 0, 0, 0, 0, 0, 0, 10, 8, 12, 14],
          2025: [12, 10, 14, 12, 16, 14, 12, 0, 0, 0, 0, 0],
        },
      },
      {
        id: "e14", name: "Rahul Tiwari", position: "DevOps",
        hours: {
          2024: [0, 0, 0, 0, 0, 0, 0, 0, 8, 6, 10, 12],
          2025: [10, 8, 12, 10, 14, 12, 10, 0, 0, 0, 0, 0],
        },
      },
    ],
    monthlyHours: {
      2024: [0, 0, 0, 0, 0, 0, 0, 0, 50, 42, 58, 66],
      2025: [58, 50, 70, 58, 78, 66, 58, 0, 0, 0, 0, 0],
    },
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = [2022, 2023, 2024, 2025];

// ─── Avatar palette ───────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
  "bg-teal-100 text-teal-600",
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  BarChart2: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

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
        <Icons.ChevronDown />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[120px]">
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
  data, labels, barColor, animate, height = 160,
}: {
  data: number[]; labels: string[]; barColor: string; animate: boolean; height?: number;
}) {
  const max = Math.max(...data, 1);
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((max / ySteps) * (ySteps - i))
  );

  return (
    <div className="w-full flex gap-3 pt-2">
      <div className="flex flex-col justify-between pb-6 pr-1" style={{ minWidth: 28 }}>
        {yLabels.map((v, i) => (
          <span key={i} className="text-[10px] text-slate-300 font-semibold leading-none text-right">{v}h</span>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end gap-1 relative" style={{ height }}>
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yLabels.map((_, i) => (
              <div key={i} className="w-full border-t border-slate-100" />
            ))}
          </div>
          {data.map((val, i) => {
            const heightPct = max > 0 ? (val / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full group relative">
                {val > 0 && (
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                    <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">{val}h</div>
                    <div className="w-2 h-1 bg-slate-800 mx-auto" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                  </div>
                )}
                <div className="w-full flex items-end h-full">
                  <div
                    className="w-full rounded-t-md transition-all duration-700 ease-out cursor-default"
                    style={{
                      height: animate ? `${heightPct}%` : "0%",
                      background: val === 0 ? "#f1f5f9" : barColor,
                      minHeight: val > 0 ? 3 : 0,
                      transitionDelay: `${i * 40}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-2">
          {labels.map((m) => (
            <div key={m} className="flex-1 text-center text-[10px] text-slate-400 font-semibold">{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal bar (employee hours comparison) ───────────────────────────────
function HorizontalBars({
  employees, monthIndex, year, animate,
}: {
  employees: Employee[]; monthIndex: number; year: number; animate: boolean;
}) {
  const data = employees.map((e) => ({
    name: e.name,
    position: e.position,
    hours: e.hours[year]?.[monthIndex] ?? 0,
  }));
  const max = Math.max(...data.map((d) => d.hours), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => {
        const pct = max > 0 ? (d.hours / max) * 100 : 0;
        const palette = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
        return (
          <div key={d.name} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${palette}`}>
              {getInitials(d.name)}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-semibold text-slate-700">{d.name}</span>
                <span className="text-xs font-bold text-slate-500">{d.hours}h</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: animate ? `${pct}%` : "0%",
                    background: "linear-gradient(90deg,#6366f1,#818cf8)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Module status config ─────────────────────────────────────────────────────
const MODULE_STATUS: Record<ModuleStatus, { label: string; bg: string; text: string; border: string; dot: string; icon: React.ReactNode }> = {
  completed:   { label: "Completed",   bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-100", dot: "bg-emerald-400", icon: <Icons.Check /> },
  ongoing:     { label: "Ongoing",     bg: "bg-amber-50",    text: "text-amber-700",    border: "border-amber-100",   dot: "bg-amber-400",   icon: <Icons.Zap /> },
  not_started: { label: "Not Started", bg: "bg-slate-100",   text: "text-slate-500",    border: "border-slate-200",   dot: "bg-slate-300",   icon: <Icons.Clock /> },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params?.id as string) ?? "1";

  const project = MOCK_PROJECTS[projectId] ?? MOCK_PROJECTS["1"];

  const [loaded, setLoaded] = useState(false);

  // Employee hours chart controls
  const [empYear, setEmpYear] = useState<number>(2025);
  const [empMonth, setEmpMonth] = useState<string>("Jun");
  const [animEmp, setAnimEmp] = useState(false);

  // Overall chart controls
  const [overallYear, setOverallYear] = useState<number>(2025);
  const [animOverall, setAnimOverall] = useState(false);

  const availableYears = Object.keys(project.monthlyHours).map(Number).sort();

  useEffect(() => {
    const t = setTimeout(() => { setLoaded(true); setAnimEmp(true); setAnimOverall(true); }, 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { setAnimEmp(false); setTimeout(() => setAnimEmp(true), 40); }, [empYear, empMonth]);
  useEffect(() => { setAnimOverall(false); setTimeout(() => setAnimOverall(true), 40); }, [overallYear]);

  const empMonthIndex = MONTHS.indexOf(empMonth);
  const overallData = project.monthlyHours[overallYear] ?? Array(12).fill(0);
  const overallTotal = overallData.reduce((s, v) => s + v, 0);

  const completedCount = project.modules.filter((m) => m.status === "completed").length;
  const ongoingCount = project.modules.filter((m) => m.status === "ongoing").length;
  const notStartedCount = project.modules.filter((m) => m.status === "not_started").length;

  const totalYTD = (project.monthlyHours[2025] ?? []).reduce((s, v) => s + v, 0);
  const totalEmployees = project.employees.length;

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8">

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
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-500 px-2.5 py-1 rounded-full border border-indigo-100">{project.category}</span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">Led by <span className="font-semibold text-slate-500">{project.lead}</span> · Started {project.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">AD</div>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Team Members", value: totalEmployees, sub: "active", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-400" },
            { label: "Modules Done", value: completedCount, sub: `of ${project.modules.length}`, bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
            { label: "In Progress", value: ongoingCount, sub: "modules", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
            { label: "Hours in 2025", value: `${totalYTD}h`, sub: "year to date", bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl px-4 py-3.5 flex flex-col gap-1 border border-transparent`}>
              <div className="flex items-center justify-between">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${s.text} opacity-60`}>{s.sub}</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 leading-none mt-1">{s.value}</p>
              <p className={`text-[11px] font-bold ${s.text}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Row: Employee hours chart + Modules list */}
        <div className="grid grid-cols-[1fr_380px] gap-5 mb-5">

          {/* Employee hours this month */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icons.Users />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Employee Hours</p>
                  <p className="text-xs text-slate-400 mt-0.5">Time spent per team member this month</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select<string>
                  value={empMonth}
                  options={MONTHS}
                  onChange={setEmpMonth}
                  label="Month"
                />
                <Select<number>
                  value={empYear}
                  options={availableYears.filter((y) => YEARS.includes(y))}
                  onChange={setEmpYear}
                  label="Year"
                />
              </div>
            </div>
            <HorizontalBars
              employees={project.employees}
              monthIndex={empMonthIndex}
              year={empYear}
              animate={animEmp}
            />
          </div>

          {/* Modules */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.Layers />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Modules</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="text-emerald-600 font-semibold">{completedCount} done</span>
                  <span className="text-slate-300 mx-1">·</span>
                  <span className="text-amber-600 font-semibold">{ongoingCount} ongoing</span>
                  <span className="text-slate-300 mx-1">·</span>
                  <span className="text-slate-400 font-semibold">{notStartedCount} pending</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1 overflow-auto">
              {project.modules.map((mod) => {
                const s = MODULE_STATUS[mod.status];
                return (
                  <div
                    key={mod.name}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 border ${s.bg} ${s.border}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${s.bg} ${s.text} border ${s.border}`}>
                        {s.icon}
                      </span>
                      <span className={`text-xs font-semibold truncate ${mod.status === "not_started" ? "text-slate-400" : "text-slate-700"}`}>
                        {mod.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {mod.deadline && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                          <Icons.Calendar />
                          {mod.deadline}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overall monthly hours chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.BarChart2 />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Overall Monthly Hours</p>
                <p className="text-xs text-slate-400 mt-0.5">Total time logged on this project across all team members</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1">
                <span className="text-xs font-extrabold text-indigo-700">{overallTotal}h</span>
                <span className="text-[10px] text-indigo-400 font-semibold">total</span>
              </div>
              <Select<number>
                value={overallYear}
                options={availableYears}
                onChange={setOverallYear}
                label="Year"
              />
            </div>
          </div>
          <BarChart
            data={overallData}
            labels={MONTHS}
            barColor="linear-gradient(180deg,#6366f1,#818cf8)"
            animate={animOverall}
            height={160}
          />
        </div>

        Employee list
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icons.Users />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Team</p>
              <p className="text-xs text-slate-400 mt-0.5">{project.employees.length} member{project.employees.length !== 1 ? "s" : ""} on this project</p>
            </div>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
            {["Name", "Position", "This Month", "This Year"].map((h) => (
              <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          <ul className="divide-y divide-slate-50">
            {project.employees.map((emp, i) => {
              const palette = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
              const thisMonth = emp.hours[2025]?.[empMonthIndex] ?? 0;
              const thisYear = (emp.hours[2025] ?? []).reduce((s, v) => s + v, 0);
             
              return (
                <li key={emp.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${palette}`}>
                      {getInitials(emp.name)}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 truncate">{emp.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-fit">{emp.position}</span>
                  <span className="text-sm font-bold text-slate-700">{thisMonth}h</span>
                  <span className="text-sm font-bold text-slate-700">{thisYear}h</span>
                 
                </li>
              );
            })}
          </ul>
        </div>

      </main>
    </div>
  );
}