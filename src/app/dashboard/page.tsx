"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockData = {
  stats: {
    employeeCount: 15,
    departmentCount: 3,
    ongoingProjects: 3,
    supportTickets: 8,
  },
  recentActivity: [
    { id: 1, user: "Priya Menon",   action: "Joined Engineering Dept.",   time: "2m ago",  initials: "PM", color: "bg-violet-100 text-violet-600" },
    { id: 2, user: "Rajan Iyer",    action: "Launched Campaign #34",       time: "18m ago", initials: "RI", color: "bg-sky-100 text-sky-600" },
    { id: 3, user: "Sneha Nair",    action: "Closed Support Ticket #1892", time: "1h ago",  initials: "SN", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, user: "Arjun Pillai",  action: "Updated Project Roadmap",     time: "3h ago",  initials: "AP", color: "bg-amber-100 text-amber-600" },
    { id: 5, user: "Divya Sharma",  action: "Added 3 new employees",       time: "5h ago",  initials: "DS", color: "bg-rose-100 text-rose-600" },
  ],
  departments: [
    { name: "Development", count: 8, pct: 90 },
    { name: "Marketing",   count: 3, pct: 60 },
    { name: "Social Media",  count: 4, pct: 80 },
  ],
  projectStatus: [
    { label: "On Track", count: 29, color: "#10b981", tw: "text-emerald-500" },
    { label: "At Risk",  count: 12, color: "#f59e0b", tw: "text-amber-500" },
    { label: "Critical", count: 6,  color: "#f43f5e", tw: "text-rose-500" },
  ],
};

// ─── Count-up ────────────────────────────────────────────────────────────────
function useCountUp(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = target / (1300 / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setV(target); clearInterval(t); }
      else setV(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return v;
}

// ─── Icons (minimal set for dashboard) ────────────────────────────────────────
const Icons = {
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  Rocket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  Headphones: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  FolderOpen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconBg, iconColor, trend, trendUp }: {
  label: string; value: number; icon: React.FC;
  iconBg: string; iconColor: string; trend: string; trendUp: boolean;
}) {
  const display = useCountUp(value);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
          {trendUp ? <Icons.TrendUp /> : <Icons.TrendDown />}
          {trend}
        </span>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{display.toLocaleString()}</p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-40 ${iconBg}`} />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  const { stats, recentActivity, departments, projectStatus } = mockData;
  const total = projectStatus.reduce((s, x) => s + x.count, 0);
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <main className="ml-56 flex-1 px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back, Admin</h1>
            <p className="text-sm text-slate-400 mt-1">Here's what's happening across your organisation today.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">AD</div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Employees"   value={stats.employeeCount}  icon={Icons.Users}      iconBg="bg-indigo-50"  iconColor="text-indigo-600" trend="4.2% this month"   trendUp={true} />
          <StatCard label="Departments"       value={stats.departmentCount} icon={Icons.Building}   iconBg="bg-sky-50"     iconColor="text-sky-500"    trend="1 new this month"  trendUp={true} />
          <StatCard label="Ongoing Projects"  value={stats.ongoingProjects} icon={Icons.Rocket}     iconBg="bg-emerald-50" iconColor="text-emerald-600" trend="3 behind schedule" trendUp={false} />
          <StatCard label="Support Tickets"   value={stats.supportTickets}  icon={Icons.Headphones} iconBg="bg-amber-50"   iconColor="text-amber-500"  trend="12% last week"    trendUp={false} />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {/* Department Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-slate-800">Department Headcount</p>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Top 5</span>
            </div>
            <div className="flex flex-col gap-3.5">
              {departments.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium w-24 flex-shrink-0">{d.name}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${d.pct}%`,
                        background: ["linear-gradient(90deg,#6366f1,#8b5cf6)","linear-gradient(90deg,#0ea5e9,#6366f1)","linear-gradient(90deg,#10b981,#0ea5e9)","linear-gradient(90deg,#f59e0b,#10b981)","linear-gradient(90deg,#f43f5e,#f59e0b)"][i]
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-800">Project Status</p>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">{stats.ongoingProjects} active</span>
            </div>
            <div className="flex justify-center my-1">
              <svg width="148" height="148" viewBox="0 0 160 160">
                {(() => {
                  let offset = 0;
                  const r = 60, circ = 2 * Math.PI * r;
                  return projectStatus.map((seg) => {
                    const pct = seg.count / total;
                    const dash = circ * pct - 4;
                    const el = (<circle key={seg.label} cx="80" cy="80" r={r} fill="none" stroke={seg.color} strokeWidth={16} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-circ * offset} strokeLinecap="round" transform="rotate(-90 80 80)" />);
                    offset += pct;
                    return el;
                  });
                })()}
                <circle cx="80" cy="80" r="44" fill="white" />
                <text x="80" y="76" textAnchor="middle" style={{ fill: "#0f172a", fontSize: 26, fontWeight: 800, fontFamily: "inherit" }}>{stats.ongoingProjects}</text>
                <text x="80" y="92" textAnchor="middle" style={{ fill: "#94a3b8", fontSize: 9, fontFamily: "inherit", letterSpacing: 1, fontWeight: 600 }}>PROJECTS</text>
              </svg>
            </div>
            <div className="flex justify-around mt-auto pt-2">
              {projectStatus.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className={`text-lg font-extrabold text-slate-900`}>{s.count}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-800">Recent Activity</p>
              <button className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">View all →</button>
            </div>
            <div className="flex flex-col divide-y divide-slate-50">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.color}`}>{item.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{item.user}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.action}</p>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {/* Primary */}
          <button className="group flex items-center gap-5 p-6 rounded-2xl bg-indigo-600 border-none text-left overflow-hidden relative shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-200 cursor-pointer" onClick={() => router.push("/dashboard/employee-overview")}>
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Icons.BarChart />
            </div>
            <div className="flex-1">
              <p className="text-base font-extrabold text-white tracking-tight">View Employee Statistics</p>
              <p className="text-xs text-indigo-200 mt-1">Headcount, attrition & growth trends</p>
            </div>
            <span className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-200">
              <Icons.ArrowRight />
            </span>
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute right-8 -bottom-8 w-20 h-20 rounded-full bg-white/5" />
          </button>

          {/* Secondary */}
          <button onClick={() => router.push("/dashboard/project-overview")} className="group flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-200 text-left shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Icons.FolderOpen />
            </div>
            <div className="flex-1">
              <p className="text-base font-extrabold text-slate-900 tracking-tight">Understand Project Stats</p>
              <p className="text-xs text-slate-400 mt-1">Timelines, risks & campaign health</p>
            </div>
            <span className="text-slate-200 group-hover:text-slate-500 group-hover:translate-x-1 transition-all duration-200">
              <Icons.ArrowRight />
            </span>
          </button>
        </div>

      </main>
    </div>
  );
}