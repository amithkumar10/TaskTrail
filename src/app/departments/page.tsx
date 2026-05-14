"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type Member = { name: string; initials: string };

type Department = {
  _id: string;
  name: string;
  head: string;
  description: string;
  members: Member[];
  color: { bg: string; text: string; dot: string; iconBg: string; iconText: string };
};

// ─── Department colour palette ────────────────────────────────────────────────
const DEPT_COLORS = [
  { bg: "bg-violet-50 dark:bg-violet-500/15",  text: "text-violet-700 dark:text-violet-300",  dot: "bg-violet-400 dark:bg-violet-300",  iconBg: "bg-violet-100 dark:bg-violet-500/20", iconText: "text-violet-600 dark:text-violet-300"  },
  { bg: "bg-sky-50 dark:bg-sky-500/15",     text: "text-sky-700 dark:text-sky-300",      dot: "bg-sky-400 dark:bg-sky-300",     iconBg: "bg-sky-100 dark:bg-sky-500/20",    iconText: "text-sky-600 dark:text-sky-300"     },
  { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300",  dot: "bg-emerald-400 dark:bg-emerald-300", iconBg: "bg-emerald-100 dark:bg-emerald-500/20",iconText: "text-emerald-600 dark:text-emerald-300" },
  { bg: "bg-amber-50 dark:bg-amber-500/15",   text: "text-amber-700 dark:text-amber-300",    dot: "bg-amber-400 dark:bg-amber-300",   iconBg: "bg-amber-100 dark:bg-amber-500/20",  iconText: "text-amber-600 dark:text-amber-300"   },
  { bg: "bg-rose-50 dark:bg-rose-500/15",    text: "text-rose-700 dark:text-rose-300",     dot: "bg-rose-400 dark:bg-rose-300",    iconBg: "bg-rose-100 dark:bg-rose-500/20",   iconText: "text-rose-600 dark:text-rose-300"    },
  { bg: "bg-indigo-50 dark:bg-indigo-500/15",  text: "text-indigo-700 dark:text-indigo-300",   dot: "bg-indigo-400 dark:bg-indigo-300",  iconBg: "bg-indigo-100 dark:bg-indigo-500/20", iconText: "text-indigo-600 dark:text-indigo-300"  },
];

const avatarPalette = [
  "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
];

function initials(name: string) {
  const p = name.trim().split(" ");
  return p.length >= 2 ? `${p[0][0]}${p[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DEPARTMENTS: Department[] = [
  {
    _id: "development",
    name: "Development",
    head: "Elton Dias",
    description: "Responsible for building and maintaining all software products and internal tooling.",
    members: [
      { name: "Amith Kumar",   initials: "AK" },
      { name: "Akshay",        initials: "AK" },
      { name: "Alzaahid Nadaf",initials: "AN" },
    ],
    color: DEPT_COLORS[0],
  },
  {
    _id: "social-media",
    name: "Social Media",
    head: "Simplicio",
    description: "Manages brand presence across all social platforms and drives community engagement.",
    members: [
      { name: "Amin", initials: "AM" },
    ],
    color: DEPT_COLORS[1],
  },
  {
    _id: "marketing",
    name: "Marketing",
    head: "Elton Dias",
    description: "Drives growth through campaigns, content strategy, and market research initiatives.",
    members: [],
    color: DEPT_COLORS[2],
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
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
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────
function Checkbox({
  checked, indeterminate, onChange,
}: {
  checked: boolean; indeterminate?: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); onChange(); }}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
        checked
          ? "bg-indigo-600 border-indigo-600"
          : indeterminate
          ? "bg-indigo-100 border-indigo-400"
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

// ─── Add Department Slide Panel ───────────────────────────────────────────────
function AddDepartmentPanel({
  open, onClose, onAdd, existingColors,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (d: Omit<Department, "_id" | "color">) => void;
  existingColors: number;
}) {
  const [name,        setName]        = useState("");
  const [head,        setHead]        = useState("");
  const [description, setDescription] = useState("");
  const [error,       setError]       = useState("");

  const reset = () => { setName(""); setHead(""); setDescription(""); setError(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Department name is required."); return; }
    onAdd({ name: name.trim(), head: head.trim() || "—", description: description.trim(), members: [] });
    reset();
    onClose();
  };

  const Field = ({
    label, value, onChange, placeholder, multiline,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; multiline?: boolean;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
        />
      )}
    </div>
  );

  // Preview the colour that will be assigned
  const previewColor = DEPT_COLORS[existingColors % DEPT_COLORS.length];

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <aside className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl shadow-slate-900/15 z-50 flex flex-col transition-all duration-300 ease-out ${open ? "translate-x-0 visible" : "translate-x-full invisible"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icons.Plus />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add Department</p>
              <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Icons.X />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
              <Icons.AlertCircle />
              {error}
            </div>
          )}

          <Field label="Department Name *" value={name} onChange={setName} placeholder="e.g. Design" />
          <Field label="Department Head"   value={head} onChange={setHead} placeholder="e.g. Elton Dias" />
          <Field label="Description"       value={description} onChange={setDescription} placeholder="What does this department do?" multiline />

          {/* Colour preview */}
          {name.trim() && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-slate-500">Preview</p>
              <div className={`${previewColor.bg} rounded-xl px-4 py-3.5 flex items-center gap-3`}>
                <div className={`w-8 h-8 rounded-lg ${previewColor.iconBg} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${previewColor.iconText}`}>
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-bold ${previewColor.text}`}>{name.trim()}</p>
                  <p className="text-xs text-slate-500">{head.trim() || "No head assigned"}</p>
                </div>
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
            Add Department
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  count, names, onConfirm, onCancel,
}: {
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
          <p className="text-sm font-bold text-slate-800">
            Delete {count} department{count > 1 ? "s" : ""}?
          </p>
          <p className="text-xs text-slate-500 mt-1.5 mb-3">
            This action cannot be undone.
          </p>
          {/* List names being deleted */}
          <div className="flex flex-col gap-1 mb-4">
            {names.map((n) => (
              <div key={n} className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span className="text-xs font-semibold text-rose-700">{n}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-xl transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Member Avatars Stack ─────────────────────────────────────────────────────
function MemberStack({ members }: { members: Member[] }) {
  const visible = members.slice(0, 4);
  const overflow = members.length - visible.length;

  if (members.length === 0) {
    return <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">No members</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((m, i) => (
          <div
            key={m.name + i}
            title={m.name}
            className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold shrink-0 ${avatarPalette[i % avatarPalette.length]}`}
          >
            {m.initials}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-500 dark:text-slate-300">
            +{overflow}
          </div>
        )}
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {members.length} member{members.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DepartmentsPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loaded,      setLoaded]      = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  const filtered = departments.filter((d) => {
    const q = search.toLowerCase();
    return !search ||
      d.name.toLowerCase().includes(q) ||
      d.head.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.members.some((m) => m.name.toLowerCase().includes(q));
  });

  const allSelected  = filtered.length > 0 && filtered.every((d) => selected.has(d._id));
  const someSelected = filtered.some((d) => selected.has(d._id));
  const selectedCount = selected.size;

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) filtered.forEach((d) => next.delete(d._id));
    else             filtered.forEach((d) => next.add(d._id));
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleAdd = (dept: Omit<Department, "_id" | "color">) => {
    const newDept: Department = {
      ...dept,
      _id:   dept.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      color: DEPT_COLORS[departments.length % DEPT_COLORS.length],
    };
    setDepartments((prev) => [newDept, ...prev]);
  };

  const handleDelete = () => {
    setDepartments((prev) => prev.filter((d) => !selected.has(d._id)));
    setSelected(new Set());
    setDeleteModal(false);
  };

  const selectedNames = departments
    .filter((d) => selected.has(d._id))
    .map((d) => d.name);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex overflow-x-hidden transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Departments</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your organisation's departments and their teams.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm hover:bg-slate-50 transition-colors">
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">
              AD
            </div>
          </div>
        </div>

        {/* ── Summary stat cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Departments",
              value: departments.length,
              color: "bg-indigo-50 dark:bg-indigo-500/15",
              text:  "text-indigo-600 dark:text-indigo-300",
              dot:   "bg-indigo-400 dark:bg-indigo-300",
            },
            {
              label: "Total Members",
              value: departments.reduce((s, d) => s + d.members.length, 0),
              color: "bg-emerald-50 dark:bg-emerald-500/15",
              text:  "text-emerald-600 dark:text-emerald-300",
              dot:   "bg-emerald-400 dark:bg-emerald-300",
            },
            {
              label: "Departments with Members",
              value: departments.filter((d) => d.members.length > 0).length,
              color: "bg-violet-50 dark:bg-violet-500/15",
              text:  "text-violet-600 dark:text-violet-300",
              dot:   "bg-violet-400 dark:bg-violet-300",
            },
          ].map(({ label, value, color, text, dot }) => (
            <div key={label} className={`${color} rounded-2xl px-5 py-4 flex flex-col gap-1`}>
              <div className="flex items-center justify-between">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${text} opacity-60`}>stat</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-none mt-1">{value}</p>
              <p className={`text-xs font-bold ${text}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Main card ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-visible">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.Building />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Department List</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {departments.length} department{departments.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">

              {/* Delete selected */}
              {someSelected && (
                <button
                  onClick={() => setDeleteModal(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-2 rounded-xl transition-colors"
                >
                  <Icons.Trash />
                  Delete {selectedCount}
                </button>
              )}

              {/* Search */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-52 shadow-sm">
                <span className="text-slate-400"><Icons.Search /></span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search departments…"
                  className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
              </div>

              {/* Add button */}
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
              >
                <Icons.Plus />
                Add Department
              </button>
            </div>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[32px_2.5fr_1.5fr_2.5fr_2fr_32px] gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 items-center">
            <Checkbox
              checked={allSelected}
              indeterminate={!allSelected && someSelected}
              onChange={toggleAll}
            />
            {["Department", "Head", "Description", "Members"].map((h) => (
              <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Icons.Building />
              </div>
              <p className="text-sm font-semibold text-slate-500">No departments found</p>
              <p className="text-xs mt-1">
                {search ? "Try a different search term." : "Add your first department using the button above."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map((dept) => {
                const isSelected = selected.has(dept._id);
                const c = dept.color;

                return (
                  <li
                    key={dept._id}
                    className={`grid grid-cols-[32px_2.5fr_1.5fr_2.5fr_2fr_32px] gap-4 items-center px-6 py-4 transition-colors group ${
                      isSelected ? "bg-indigo-50/50 dark:bg-indigo-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <Checkbox checked={isSelected} onChange={() => toggleOne(dept._id)} />

                    {/* Dept name + colour badge */}
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => router.push(`/dashboard/departments/${dept._id}`)}
                    >
                      <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${c.iconText}`}>
                          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{dept.name}</p>
                        <span className={`text-[10px] font-semibold ${c.text} ${c.bg} px-1.5 py-0.5 rounded-full`}>
                          department
                        </span>
                      </div>
                    </div>

                    {/* Head */}
                    <span
                      className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate cursor-pointer"
                      onClick={() => router.push(`/dashboard/departments/${dept._id}`)}
                    >
                      {dept.head || "—"}
                    </span>

                    {/* Description */}
                    <p
                      className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed line-clamp-2 cursor-pointer"
                      onClick={() => router.push(`/dashboard/departments/${dept._id}`)}
                    >
                      {dept.description || "—"}
                    </p>

                    {/* Members */}
                    <div
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/departments/${dept._id}`)}
                    >
                      <MemberStack members={dept.members} />
                    </div>

                    {/* Arrow */}
                    <span
                      className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/departments/${dept._id}`)}
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
                Showing{" "}
                <span className="font-semibold text-slate-600">{filtered.length}</span>
                {" "}of{" "}
                <span className="font-semibold text-slate-600">{departments.length}</span>
                {" "}departments
              </p>
              {someSelected && (
                <p className="text-xs text-indigo-600 font-semibold">{selectedCount} selected</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Add Department Slide Panel ─────────────────────────────────────── */}
      <AddDepartmentPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAdd={handleAdd}
        existingColors={departments.length}
      />

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
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