"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModuleStatus = "not_started" | "ongoing" | "support" | "completed";

interface Module {
  name: string;
  status: ModuleStatus;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  modules: Module[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Folder: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
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
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    _id: "1",
    name: "Ramnathi",
    description: "Core platform for managing real-estate workflows and property records.",
    modules: [
      { name: "User Auth", status: "completed" },
      { name: "Dashboard", status: "support" },
      { name: "Reporting Engine", status: "ongoing" },
      { name: "Notifications", status: "ongoing" },
    ],
  },
  {
    _id: "2",
    name: "Wadigo",
    description: "Logistics and route-optimisation tool for last-mile delivery teams.",
    modules: [
      { name: "Route Planner", status: "ongoing" },
      { name: "Driver App", status: "not_started" },
      { name: "Analytics", status: "not_started" },
    ],
  },
  {
    _id: "3",
    name: "Saraswat",
    description: "Banking & finance portal for cooperative credit societies.",
    modules: [
      { name: "Core Banking", status: "completed" },
      { name: "Loan Module", status: "completed" },
      { name: "Customer Support Portal", status: "support" },
      { name: "Mobile App", status: "support" },
    ],
  },
  {
    _id: "4",
    name: "Astrix HR App",
    description: "Mobile HR application for employee self-service and payroll.",
    modules: [
      { name: "Attendance", status: "ongoing" },
      { name: "Leave Management", status: "ongoing" },
      { name: "Payroll", status: "not_started" },
    ],
  },
  {
    _id: "5",
    name: "Astrix HR Web",
    description: "Web-based HR management console for administrators.",
    modules: [
      { name: "Employee Records", status: "completed" },
      { name: "Recruitment", status: "ongoing" },
      { name: "Performance Review", status: "not_started" },
      { name: "Reports", status: "not_started" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getProjectFlags(project: Project) {
  const s = project.modules.map((m) => m.status);
  return {
    hasOngoing: s.includes("ongoing"),
    hasSupport: s.includes("support"),
    hasNotStarted: s.includes("not_started"),
  };
}

type FilterType = "All" | "Ongoing" | "Support" | "Both";

// ─── Checkbox ─────────────────────────────────────────────────────────────────
function Checkbox({ checked, indeterminate, onChange }: {
  checked: boolean; indeterminate?: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); onChange(); }}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
        checked ? "bg-indigo-600 border-indigo-600"
        : indeterminate ? "bg-indigo-100 border-indigo-400"
        : "border-slate-300 bg-white hover:border-indigo-400"
      }`}>
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {!checked && indeterminate && <div className="w-2 h-0.5 bg-indigo-500 rounded-full" />}
      </div>
    </label>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ count, names, onConfirm, onCancel }: {
  count: number; names: string[]; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/15 p-6 w-[340px] pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
            <Icons.Trash />
          </div>
          <p className="text-sm font-bold text-slate-800">Delete {count} project{count > 1 ? "s" : ""}?</p>
          <p className="text-xs text-slate-500 mt-1.5 mb-3">This action cannot be undone.</p>
          <div className="flex flex-col gap-1 mb-5">
            {names.map((n) => (
              <div key={n} className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span className="text-xs font-semibold text-rose-700">{n}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-xl transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Add Project Panel ────────────────────────────────────────────────────────
function AddProjectPanel({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (p: Omit<Project, "_id">) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<string[]>([""]);
  const [error, setError] = useState("");

  const reset = () => { setName(""); setDescription(""); setModules([""]); setError(""); };
  const handleClose = () => { reset(); onClose(); };

  const addModuleField = () => setModules((prev) => [...prev, ""]);
  const removeModuleField = (i: number) => setModules((prev) => prev.filter((_, idx) => idx !== i));
  const updateModule = (i: number, val: string) => setModules((prev) => prev.map((m, idx) => idx === i ? val : m));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Project name is required."); return; }
    const filteredModules: Module[] = modules
      .filter((m) => m.trim())
      .map((m) => ({ name: m.trim(), status: "not_started" as ModuleStatus }));
    onAdd({ name: name.trim(), description: description.trim(), modules: filteredModules });
    reset();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Slide panel */}
      <aside className={`fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl shadow-slate-900/15 z-50 flex flex-col transition-all duration-300 ease-out ${open ? "translate-x-0 visible" : "translate-x-full invisible"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icons.Plus />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add Project</p>
              <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Icons.X />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
              <Icons.AlertCircle />{error}
            </div>
          )}

          {/* Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramnathi"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this project do?"
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>

          {/* Modules */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">Modules</label>
              <span className="text-[10px] text-slate-400 font-medium">All start as "Not Started"</span>
            </div>

            <div className="flex flex-col gap-2">
              {modules.map((mod, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    <input
                      type="text"
                      value={mod}
                      onChange={(e) => updateModule(i, e.target.value)}
                      placeholder={`Module ${i + 1} name`}
                      className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none flex-1"
                    />
                    <span className="text-[10px] font-semibold text-slate-300 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full shrink-0">
                      Not started
                    </span>
                  </div>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModuleField(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Icons.X />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addModuleField}
              className="flex items-center gap-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors w-full justify-center border border-dashed border-indigo-200"
            >
              <Icons.Plus />
              Add Module
            </button>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-slate-500">Preview</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                    <Icons.Folder />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{name.trim()}</p>
                    {description.trim() && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{description.trim()}</p>}
                  </div>
                </div>
                {modules.filter((m) => m.trim()).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {modules.filter((m) => m.trim()).slice(0, 4).map((m, i) => (
                      <span key={i} className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{m}</span>
                    ))}
                    {modules.filter((m) => m.trim()).length > 4 && (
                      <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">+{modules.filter((m) => m.trim()).length - 4} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={handleClose} className="flex-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors">
            Add Project
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Status badge helpers ─────────────────────────────────────────────────────
function StatusBadges({ project }: { project: Project }) {
  const { hasOngoing, hasSupport } = getProjectFlags(project);
  const allDone = project.modules.length > 0 && project.modules.every((m) => m.status === "completed");
  const allNew = project.modules.every((m) => m.status === "not_started");

  if (project.modules.length === 0 || allNew) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        Not Started
      </span>
    );
  }
  if (allDone) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
        Completed
      </span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {hasOngoing && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-100">
          <Icons.Zap /> Ongoing
        </span>
      )}
      {hasSupport && (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 border border-sky-100">
          <Icons.Headphones /> Support
        </span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panelOpen, setPanelOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) setFilterMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = projects.filter((p) => {
    const { hasOngoing, hasSupport } = getProjectFlags(p);
    const matchesFilter =
      filter === "All" ||
      (filter === "Ongoing" && hasOngoing) ||
      (filter === "Support" && hasSupport) ||
      (filter === "Both" && hasOngoing && hasSupport);
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p._id));
  const someSelected = filtered.some((p) => selected.has(p._id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) filtered.forEach((p) => next.delete(p._id));
    else filtered.forEach((p) => next.add(p._id));
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleAdd = (p: Omit<Project, "_id">) => {
    setProjects((prev) => [{ ...p, _id: Date.now().toString() }, ...prev]);
  };
  const handleDelete = () => {
    setProjects((prev) => prev.filter((p) => !selected.has(p._id)));
    setSelected(new Set());
    setDeleteModal(false);
  };

  const selectedNames = projects.filter((p) => selected.has(p._id)).map((p) => p.name);
  const selectedCount = selected.size;

  // Summary stats
  const totalModules = projects.reduce((s, p) => s + p.modules.length, 0);
  const ongoingCount = projects.filter((p) => getProjectFlags(p).hasOngoing).length;
  const supportCount = projects.filter((p) => getProjectFlags(p).hasSupport).length;

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex overflow-x-hidden transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
         
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
              <p className="text-sm text-slate-400 mt-1">Browse and manage all projects in your organisation.</p>
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

        {/* Summary stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Projects",    value: projects.length,  color: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-400"  },
            { label: "Total Modules",     value: totalModules,     color: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-400"  },
            { label: "Ongoing Projects",  value: ongoingCount,     color: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400"   },
            { label: "In Support",        value: supportCount,     color: "bg-sky-50",     text: "text-sky-600",     dot: "bg-sky-400"     },
          ].map(({ label, value, color, text, dot }) => (
            <div key={label} className={`${color} rounded-2xl px-5 py-4 flex flex-col gap-1`}>
              <div className="flex items-center justify-between">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${text} opacity-60`}>stat</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 leading-none mt-1">{value}</p>
              <p className={`text-xs font-bold ${text}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.Folder />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Project List</p>
                <p className="text-xs text-slate-400 mt-0.5">{projects.length} total project{projects.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {someSelected && (
                <button
                  onClick={() => setDeleteModal(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-2 rounded-xl transition-colors"
                >
                  <Icons.Trash />
                  Delete {selectedCount}
                </button>
              )}

              {/* Filter dropdown */}
              <div ref={filterMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((o) => !o)}
                  className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-400"><Icons.Filter /></span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">Status</span>
                  <span className="text-xs font-medium text-slate-800 min-w-12 text-left">{filter}</span>
                  <span className={`text-slate-500 transition-transform ${filterMenuOpen ? "rotate-180" : "rotate-0"}`}><Icons.ChevronDown /></span>
                </button>
                {filterMenuOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                    {(["All", "Ongoing", "Support", "Both"] as FilterType[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setFilter(opt); setFilterMenuOpen(false); }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${filter === opt ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        <span>{opt}</span>
                        {filter === opt && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-52 shadow-sm">
                <span className="text-slate-400"><Icons.Search /></span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects…"
                  className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
              </div>

              {/* Add */}
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
              >
                <Icons.Plus />
                Add Project
              </button>
            </div>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[32px_2.5fr_1.5fr_2.5fr_80px_32px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 items-center">
            <Checkbox checked={allSelected} indeterminate={!allSelected && someSelected} onChange={toggleAll} />
            {["Project Name", "Status", "Description", "Modules"].map((h) => (
              <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Icons.Folder />
              </div>
              <p className="text-sm font-semibold text-slate-500">No projects found</p>
              <p className="text-xs mt-1">{search ? "Try a different search term." : "Add your first project using the button above."}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {filtered.map((project) => {
                const isSelected = selected.has(project._id);
                const moduleCount = project.modules.length;

                return (
                  <li
                    key={project._id}
                    className={`grid grid-cols-[32px_2.5fr_1.5fr_2.5fr_80px_32px] gap-4 items-center px-6 py-4 transition-colors group ${isSelected ? "bg-indigo-50/50" : "hover:bg-slate-50"}`}
                  >
                    {/* Checkbox */}
                    <Checkbox checked={isSelected} onChange={() => toggleOne(project._id)} />

                    {/* Name */}
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <Icons.Folder />
                      </div>
                      <p className="text-sm font-bold text-slate-800 truncate">{project.name}</p>
                    </div>

                    {/* Status badges */}
                    <div onClick={() => router.push(`/projects/${project._id}`)} className="cursor-pointer">
                      <StatusBadges project={project} />
                    </div>

                    {/* Description */}
                    <p
                      className="text-xs text-slate-400 leading-relaxed line-clamp-2 cursor-pointer"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      {project.description || "—"}
                    </p>

                    {/* Module count badge */}
                    <div
                      className="flex items-center gap-1.5 cursor-pointer"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                        <Icons.Layers />
                        <span className="text-xs font-bold">{moduleCount}</span>
                        <span className="text-[10px] font-semibold text-slate-400">module{moduleCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <span
                      className="text-slate-200 group-hover:text-slate-400 transition-colors cursor-pointer"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      <Icons.ChevronRight />
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-600">{projects.length}</span> projects
              </p>
              {someSelected && (
                <p className="text-xs text-indigo-600 font-semibold">{selectedCount} selected</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Project Panel */}
      <AddProjectPanel open={panelOpen} onClose={() => setPanelOpen(false)} onAdd={handleAdd} />

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          count={selectedCount}
          names={selectedNames}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
}