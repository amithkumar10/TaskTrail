"use client";

import React, { useEffect, useRef, useState } from "react";
import api from "../../utils/axiosConfig";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const companyDomain = "tasktrail.com";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
  UserSquare: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" />
      <rect x="2" y="2" width="20" height="20" rx="2" />
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
};

// ─── Avatar initials + colour ─────────────────────────────────────────────────
const avatarPalette = [
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

function getProjectList(employee: any) {
  const projects = Array.isArray(employee?.project)
    ? employee.project
    : employee?.project
      ? [employee.project]
      : [];

  return projects.filter(Boolean);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const OverviewPage = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);
  const projectMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const checkAuthorization = () => {
    const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : null;
    if (role !== "Admin") {
      window.location.href = "/unauthorized";
    }
  };

  useEffect(() => {
    checkAuthorization();
    const fetchInterns = async () => {
      try {
        const res = await api.get("/users");
        const employeesOnly = (res.data || []).filter((user) =>
          user.role === "Intern" || user.role === "Employee"
        );
        setInterns(employeesOnly);
      } catch (err) {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setRoleMenuOpen(false);
      }
      if (projectMenuRef.current && !projectMenuRef.current.contains(target)) {
        setProjectMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRoleMenuOpen(false);
        setProjectMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const projectOptions = Array.from(
    new Set(interns.flatMap((employee: any) => getProjectList(employee)))
  ).sort((a, b) => String(a).localeCompare(String(b)));

  const filtered = interns.filter((e: any) => {
    const employeeProjects = getProjectList(e);
    const searchText = search.toLowerCase();

    const matchesRole = roleFilter === "All" || e.role === roleFilter;
    const matchesProject = projectFilter === "All" || employeeProjects.includes(projectFilter);
    const matchesSearch =
      !search ||
      e.name?.toLowerCase().includes(searchText) ||
      employeeProjects.some((project: string) => project.toLowerCase().includes(searchText)) ||
      e.position?.toLowerCase().includes(searchText) ||
      e.manager?.toLowerCase().includes(searchText);

    return matchesRole && matchesProject && matchesSearch;
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
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employees</h1>
              <p className="text-sm text-slate-400 mt-1">Browse and manage all employees in your organisation.</p>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Employee List</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {loading ? "Loading…" : `${interns.length} total employee${interns.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            {/* Role filter + Search */}
            <div className="flex items-center gap-3">
              <div ref={roleMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen((open) => !open)}
                  className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-slate-400"><Icons.Filter /></span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">Role</span>
                  <span className="text-xs font-medium text-slate-800 min-w-12 text-left">{roleFilter}</span>
                  <span className={`text-slate-500 transition-transform ${roleMenuOpen ? "rotate-180" : "rotate-0"}`}>
                    <Icons.ChevronDown />
                  </span>
                </button>

                {roleMenuOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                    {[
                      { label: "All", value: "All" },
                      { label: "Intern", value: "Intern" },
                      { label: "Employee", value: "Employee" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setRoleFilter(option.value);
                          setRoleMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                          roleFilter === option.value
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span>{option.label}</span>
                        {roleFilter === option.value && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={projectMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProjectMenuOpen((open) => !open)}
                  className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-slate-400"><Icons.Filter /></span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">Project</span>
                  <span className="text-xs font-medium text-slate-800 min-w-14 text-left">{projectFilter}</span>
                  <span className={`text-slate-500 transition-transform ${projectMenuOpen ? "rotate-180" : "rotate-0"}`}>
                    <Icons.ChevronDown />
                  </span>
                </button>

                {projectMenuOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-56 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                    <button
                      type="button"
                      onClick={() => {
                        setProjectFilter("All");
                        setProjectMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                        projectFilter === "All"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span>All</span>
                      {projectFilter === "All" && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                    </button>
                    {projectOptions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-400">No projects available</div>
                    ) : (
                      projectOptions.map((project) => (
                        <button
                          key={project}
                          type="button"
                          onClick={() => {
                            setProjectFilter(project);
                            setProjectMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                            projectFilter === project
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span className="truncate pr-3">{project}</span>
                          {projectFilter === project && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2.5 w-56 shadow-sm">
                <span className="text-slate-400"><Icons.Search /></span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employees…"
                  className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[2fr_3fr_1.5fr_1.5fr_32px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
            {["Name", "Projects", "Position", "Manager"].map((h) => (
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
                <Icons.Users />
              </div>
              <p className="text-sm font-semibold text-slate-500">No employees found</p>
              <p className="text-xs mt-1">{search ? "Try a different search term." : "No employees have been added yet."}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {filtered.map((intern: any, index: number) => {
                const initials = getInitials(intern.name || "??");
                const palette = avatarPalette[index % avatarPalette.length];
                const employeeProjects = getProjectList(intern);
                return (
                  <li
                    key={intern._id || `${intern.username}-${index}`}
                    onClick={() => router.push(`/dashboard/employee-overview/${index}`)}
                    className="grid grid-cols-[2fr_3fr_1.5fr_1.5fr_32px] gap-4 items-center px-6 py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                  >
                    {/* Name + avatar */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${palette}`}>
                        {initials}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {intern.name || "Unnamed employee"}
                      </span>
                    </div>

                    {/* Projects */}
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      {employeeProjects.length === 0 ? (
                        <span className="text-xs text-slate-400 font-medium">Unassigned</span>
                      ) : (
                        employeeProjects.slice(0, 3).map((project: string) => (
                          <span
                            key={project}
                            className="max-w-full truncate rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                          >
                            {project}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Position */}
                    <span className="inline-flex">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full truncate max-w-full">
                        {intern.position || "Employee"}
                      </span>
                    </span>

                    {/* Manager */}
                    <span className="text-xs text-slate-500 font-medium truncate">{intern.manager || "—"}</span>

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
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{interns.length}</span> employees
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
