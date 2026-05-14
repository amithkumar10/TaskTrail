"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Folder: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="6 9 12 15 18 9" />
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Module {
  name: string;
  status: "ongoing" | "support" | "completed";
}

interface Project {
  _id: string;
  name: string;
  modules: Module[];
  category?: string;
  lead?: string;
  team?: string[];
}

type FilterType = "All" | "Ongoing" | "Support" | "Both";

// ─── Derived status helpers ───────────────────────────────────────────────────
function getProjectFlags(project: Project) {
  const statuses = project.modules.map((m) => m.status);
  const hasOngoing = statuses.includes("ongoing");
  const hasSupport = statuses.includes("support");
  return { hasOngoing, hasSupport };
}

function getOngoingModules(project: Project) {
  return project.modules.filter((m) => m.status === "ongoing");
}

function getSupportModules(project: Project) {
  return project.modules.filter((m) => m.status === "support");
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    _id: "1",
    name: "Ramanthi",
    modules: [
      { name: "User Auth", status: "completed" },
      { name: "Dashboard", status: "support" },
      { name: "Reporting Engine", status: "ongoing" },
      { name: "Notifications", status: "ongoing" },
    ],
  },
  {
    _id: "2",
    name: "Edulex",
    modules: [
      { name: "Course Builder", status: "ongoing" },
      { name: "Student Portal", status: "ongoing" },
      { name: "Payment Gateway", status: "support" },
      { name: "Analytics", status: "completed" },
    ],
  },
  {
    _id: "3",
    name: "Saraswat",
    modules: [
      { name: "Core Banking", status: "completed" },
      { name: "Loan Module", status: "completed" },
      { name: "Customer Support Portal", status: "support" },
      { name: "Mobile App", status: "support" },
    ],
  },
  {
    _id: "4",
    name: "Doctors Desk",
    modules: [
      { name: "Appointment Scheduler", status: "ongoing" },
      { name: "Patient Records", status: "ongoing" },
      { name: "Billing", status: "completed" },
      { name: "Lab Integration", status: "ongoing" },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProjectOverviewPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filterMenuRef.current && !filterMenuRef.current.contains(target)) {
        setFilterMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterMenuOpen(false);
    };
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const filtered = projects.filter((p) => {
    const { hasOngoing, hasSupport } = getProjectFlags(p);
    const hasBoth = hasOngoing && hasSupport;

    const matchesFilter =
      filter === "All" ||
      (filter === "Ongoing" && hasOngoing) ||
      (filter === "Support" && hasSupport) ||
      (filter === "Both" && hasBoth);

    const matchesSearch =
      !search || p.name?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
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
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
              <p className="text-sm text-slate-400 mt-1">Browse and manage all projects in your organisation.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">AD</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <Icons.AlertCircle />
            {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.Folder />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Project List</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {loading ? "Loading…" : `${projects.length} total project${projects.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            {/* Filter + Search */}
            <div className="flex items-center gap-3">
              {/* Category filter */}
              <div ref={filterMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((open) => !open)}
                  className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 transition-colors"
                    
                >
                  <span className="text-slate-400"><Icons.Filter /></span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">Status</span>
                  <span className="text-xs font-medium text-slate-800 min-w-12 text-left">{filter}</span>
                  <span className={`text-slate-500 transition-transform ${filterMenuOpen ? "rotate-180" : "rotate-0"}`}>
                    <Icons.ChevronDown />
                  </span>
                </button>

                {filterMenuOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                    {(["All", "Ongoing", "Support", "Both"] as FilterType[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => { setFilter(option); setFilterMenuOpen(false); }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                          filter === option
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span>{option}</span>
                        {filter === option && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2.5 w-56 shadow-sm">
                <span className="text-slate-400"><Icons.Search /></span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects…"
                  className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[2.5fr_1.5fr_2.5fr_2fr_32px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
            {["Project Name", "Status", "Ongoing Modules", "Support Modules"].map((h) => (
              <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
            <span />
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex flex-col gap-3 px-6 py-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Icons.Folder />
              </div>
              <p className="text-sm font-semibold text-slate-500">No projects found</p>
              <p className="text-xs mt-1">{search ? "Try a different search term." : "No projects have been added yet."}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {filtered.map((project) => {
                const { hasOngoing, hasSupport } = getProjectFlags(project);
                const ongoingModules = getOngoingModules(project);
                const supportModules = getSupportModules(project);

                return (
                  <li
                    key={project._id}
                    onClick={() => router.push(`/dashboard/project-overview/${project._id}`)}
                    className="grid grid-cols-[2.5fr_1.5fr_2.5fr_2fr_32px] gap-4 items-center px-6 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors group"
                     
                  >
                    {/* Project name */}
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {project.name || "Unnamed project"}
                    </span>

                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {!hasOngoing && !hasSupport && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          Completed
                        </span>
                      )}
                      {hasOngoing && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-100">
                          <Icons.Zap />
                          Ongoing
                        </span>
                      )}
                      {hasSupport && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 border border-sky-100">
                          <Icons.Headphones />
                          Support
                        </span>
                      )}
                    </div>

                    {/* Ongoing modules */}
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      {ongoingModules.length === 0 ? (
                        <span className="text-xs text-slate-400 font-medium">—</span>
                      ) : (
                        ongoingModules.slice(0, 3).map((mod) => (
                          <span
                            key={mod.name}
                            className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 truncate max-w-full"
                          >
                            {mod.name}
                          </span>
                        ))
                      )}
                      {ongoingModules.length > 3 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          +{ongoingModules.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Support modules */}
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      {supportModules.length === 0 ? (
                        <span className="text-xs text-slate-400 font-medium">—</span>
                      ) : (
                        supportModules.slice(0, 3).map((mod) => (
                          <span
                            key={mod.name}
                            className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 truncate max-w-full"
                          >
                            {mod.name}
                          </span>
                        ))
                      )}
                      {supportModules.length > 3 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          +{supportModules.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <span className="text-slate-200 group-hover:text-slate-400 dark:group-hover:text-slate-200 transition-colors">
                      <Icons.ChevronRight />
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-600">{projects.length}</span> projects
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectOverviewPage;