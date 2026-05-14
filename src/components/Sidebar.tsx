"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Grid: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
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
  LineChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

// ─── Nav Item ─────────────────────────────────────────────────────────────────
function NavItem({ icon: Icon, label, active, onClick }: { icon: React.FC; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 group
      ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
      <span className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}><Icon /></span>
      <span className={`text-sm ${active ? "font-bold" : "font-medium"}`}>{label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
    } catch (e) {
      // ignore
    }
    router.push("/signin");
  };

  const navItems = [
    { icon: Icons.Grid, label: "Dashboard", path: "/dashboard" },
    { icon: Icons.Users, label: "Employees", path: "/employees" },
    { icon: Icons.Building, label: "Departments", path: "/departments" },
    { icon: Icons.Rocket, label: "Projects", path: "/projects" },
    { icon: Icons.Headphones, label: "Support", path: "/support" },
  ];

  const reportItems = [
    { icon: Icons.LineChart, label: "Analytics", path: "#" },
    { icon: Icons.Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="fixed top-0 left-0 w-56 h-screen bg-white border-r border-slate-100 flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}>
              <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-800 leading-none">Tasktrail</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-1.5">Main</p>
        {navItems.map((item) => (
          <NavItem 
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={pathname === item.path || pathname.startsWith(item.path)}
            onClick={() => item.path !== "#" && router.push(item.path)}
          />
        ))}
        
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mt-4 mb-1.5">REPORTS</p>
        {reportItems.map((item) => (
          <NavItem 
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={pathname === item.path}
            onClick={() => item.path !== "#" && router.push(item.path)}
          />
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-3 relative" ref={userRef}>
        <button
          type="button"
          onClick={() => setUserMenuOpen(o => !o)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">AD</div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-slate-800">Admin</p>
            <p className="text-[10px] text-slate-400">Super User</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="w-3.5 h-3.5 text-slate-300"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>

        {userMenuOpen && (
          <div className="absolute left-3 bottom-16 w-40 bg-white border border-slate-100 rounded-xl shadow-lg p-2 z-30">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
