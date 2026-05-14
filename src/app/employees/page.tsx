"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────
type Employee = {
  _id: string;
  name: string;
  email: string;
  position: string;
  manager: string;
  role: string;
  department: string;
  projects: string[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const DEPARTMENTS = ["Development", "Social Media", "Marketing"];

const MOCK_EMPLOYEES: Employee[] = [
  {
    _id: "amith-kumar",
    name: "Amith Kumar",
    email: "amith@tasktrail.com",
    position: "Full Stack Intern",
    manager: "Elton Dias",
    role: "Intern",
    department: "Development",
    projects: ["TaskTrail Software"],
  },
  {
    _id: "amin",
    name: "Amin",
    email: "amin@tasktrail.com",
    position: "Flutter Intern",
    manager: "Elton Dias",
    role: "Intern",
    department: "Development",
    projects: ["Wadigo"],
  },
  {
    _id: "akshay",
    name: "Akshay",
    email: "akshay@tasktrail.com",
    position: "UI Intern",
    manager: "Elton",
    role: "Intern",
    department: "Development",
    projects: ["Ramanathi"],
  },
  {
    _id: "alzaahid-nadaf",
    name: "Alzaahid Nadaf",
    email: "alzaahid@tasktrail.com",
    position: "Fullstack Developer",
    manager: "Simplicio",
    role: "Employee",
    department: "Marketing",
    projects: ["Ramnathi", "Saraswat"],
  },
];

const PROJECT_SUGGESTIONS = [
  "TaskTrail Software", "Wadigo", "Ramanathi",
  "Ramnathi", "Saraswat", "Astrix HR App", "Astrix HR Web",
];

// ─── Avatar helpers ───────────────────────────────────────────────────────────
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

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
};

// ─── Styled Select ────────────────────────────────────────────────────────────
function StyledSelect({
  label, value, onChange, options, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
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

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-indigo-400 hover:border-slate-300 transition-all cursor-pointer"
        >
          <span className={selected ? "text-slate-800 font-medium" : "text-slate-400"}>
            {selected ? selected.label : (placeholder || "Select…")}
          </span>
          <span className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <Icons.ChevronDown />
          </span>
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
            {placeholder && (
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:bg-slate-50 transition-colors"
              >
                {placeholder}
              </button>
            )}
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                  value === opt.value
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {opt.label}
                {value === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tag Input (multi-project) ────────────────────────────────────────────────
function TagInput({
  value, onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput]   = useState("");
  const [open, setOpen]     = useState(false);
  const inputRef            = useRef<HTMLInputElement>(null);
  const containerRef        = useRef<HTMLDivElement>(null);

  const suggestions = PROJECT_SUGGESTIONS.filter(
    (p) => p.toLowerCase().includes(input.toLowerCase()) && !value.includes(p)
  );

  const add = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && !input && value.length) {
      remove(value[value.length - 1]);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-[40px] w-full flex flex-wrap gap-1.5 items-center rounded-xl border border-slate-200 bg-white px-3 py-2 cursor-text focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50 transition-all"
      >
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
            {tag}
            <button type="button" onClick={() => remove(tag)} className="text-indigo-400 hover:text-indigo-700 transition-colors">
              <Icons.X />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? "Type project and press Enter…" : ""}
          className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none"
        />
      </div>
      {open && (input || suggestions.length > 0) && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 max-h-44 overflow-auto">
          {suggestions.length === 0 && input.trim() ? (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); add(input); }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Add &ldquo;{input.trim()}&rdquo;
            </button>
          ) : (
            suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(s); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {s}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Add Employee Slide Panel ─────────────────────────────────────────────────
function AddEmployeePanel({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (emp: Omit<Employee, "_id">) => void;
}) {
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [position,   setPosition]   = useState("");
  const [manager,    setManager]    = useState("");
  const [role,       setRole]       = useState("Intern");
  const [department, setDepartment] = useState("");
  const [projects,   setProjects]   = useState<string[]>([]);
  const [error,      setError]      = useState("");

  const reset = () => {
    setName(""); setEmail(""); setPosition(""); setManager("");
    setRole("Intern"); setDepartment(""); setProjects([]); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    onAdd({
      name:       name.trim(),
      email:      email.trim(),
      position:   position.trim()   || "Not assigned",
      manager:    manager.trim()    || "Not assigned",
      department: department        || "Unassigned",
      role,
      projects:   projects.length ? projects : [],
    });
    reset();
    onClose();
  };

  const TextField = ({
    label, value, onChange, placeholder, type = "text",
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; type?: string;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
      />
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — invisible when closed so it can't be scrolled to */}
      <aside
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl shadow-slate-900/15 z-50 flex flex-col transition-all duration-300 ease-out ${
          open ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icons.Plus />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add Employee</p>
              <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <Icons.X />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
              <Icons.AlertCircle />
              {error}
            </div>
          )}

          <TextField label="Full Name *" value={name} onChange={setName} placeholder="e.g. Alzaahid Nadaf" />
          <TextField label="Email" value={email} onChange={setEmail} placeholder="e.g. alzaahid@company.com" type="email" />

          {/* Role */}
          <StyledSelect
            label="Role"
            value={role}
            onChange={setRole}
            options={[
              { label: "Intern",   value: "Intern"   },
              { label: "Employee", value: "Employee" },
            ]}
          />

          {/* Department */}
          <StyledSelect
            label="Department"
            value={department}
            onChange={setDepartment}
            placeholder="Select a department…"
            options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
          />

          <TextField label="Position" value={position} onChange={setPosition} placeholder="e.g. Full Stack Intern" />
          <TextField label="Manager"  value={manager}  onChange={setManager}  placeholder="e.g. Elton Dias" />

          {/* Projects tag input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Projects</label>
            <TagInput value={projects} onChange={setProjects} />
            <p className="text-[10px] text-slate-400">Type a project name and press Enter, or pick from suggestions.</p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
          >
            Add Employee
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  count, onConfirm, onCancel,
}: {
  count: number; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/15 p-6 w-80 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
            <Icons.Trash />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Delete {count} employee{count > 1 ? "s" : ""}?
          </p>
          <p className="text-xs text-slate-500 mt-1.5">
            This action cannot be undone. The selected employee{count > 1 ? "s" : ""} will be permanently removed.
          </p>
          <div className="flex gap-3 mt-5">
            <button
              onClick={onCancel}
              className="flex-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const router = useRouter();

  const [employees,    setEmployees]    = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [projFilter,   setProjFilter]   = useState("All");
  const [projMenuOpen, setProjMenuOpen] = useState(false);
  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [deleteModal,  setDeleteModal]  = useState(false);
  const [loaded,       setLoaded]       = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const projMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) setRoleMenuOpen(false);
      if (projMenuRef.current && !projMenuRef.current.contains(e.target as Node)) setProjMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setRoleMenuOpen(false); setProjMenuOpen(false); }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  const projectOptions = Array.from(
    new Set(employees.flatMap((e) => e.projects))
  ).sort((a, b) => a.localeCompare(b));

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchRole = roleFilter === "All" || e.role === roleFilter;
    const matchProj = projFilter === "All" || e.projects.includes(projFilter);
    const matchSearch = !search ||
      e.name?.toLowerCase().includes(q) ||
      e.position?.toLowerCase().includes(q) ||
      e.manager?.toLowerCase().includes(q) ||
      e.department?.toLowerCase().includes(q) ||
      e.projects.some((p) => p.toLowerCase().includes(q));
    return matchRole && matchProj && matchSearch;
  });

  const allSelected  = filtered.length > 0 && filtered.every((e) => selected.has(e._id));
  const someSelected = filtered.some((e) => selected.has(e._id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) filtered.forEach((e) => next.delete(e._id));
    else             filtered.forEach((e) => next.add(e._id));
    setSelected(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleAdd = (emp: Omit<Employee, "_id">) => {
    setEmployees((prev) => [{
      ...emp,
      _id: emp.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
    }, ...prev]);
  };

  const handleDelete = () => {
    setEmployees((prev) => prev.filter((e) => !selected.has(e._id)));
    setSelected(new Set());
    setDeleteModal(false);
  };

  const selectedCount = selected.size;

  return (
    // overflow-x-hidden prevents the off-screen panel from creating a horizontal scrollbar
    <div className={`min-h-screen bg-slate-50 font-sans flex overflow-x-hidden transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <Sidebar />

      <main className="ml-56 flex-1 px-8 py-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employees</h1>
            <p className="text-sm text-slate-400 mt-1">Browse and manage all employees in your organisation.</p>
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

        {/* ── Card ────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icons.Users />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Employee List</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {employees.length} total employee{employees.length !== 1 ? "s" : ""}
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

              {/* Role filter */}
              <div ref={roleMenuRef} className="relative">
                <button
                  onClick={() => setRoleMenuOpen((o) => !o)}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-400"><Icons.Filter /></span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">Role</span>
                  <span className="text-xs font-medium text-slate-800 min-w-[48px] text-left">{roleFilter}</span>
                  <span className={`text-slate-400 transition-transform ${roleMenuOpen ? "rotate-180" : ""}`}><Icons.ChevronDown /></span>
                </button>
                {roleMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-40 rounded-2xl border border-slate-200 bg-white shadow-lg z-20 py-1 overflow-hidden">
                    {["All", "Intern", "Employee"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setRoleFilter(opt); setRoleMenuOpen(false); }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                          roleFilter === opt ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                        {roleFilter === opt && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project filter */}
              <div ref={projMenuRef} className="relative">
                <button
                  onClick={() => setProjMenuOpen((o) => !o)}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-400"><Icons.Filter /></span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">Project</span>
                  <span className="text-xs font-medium text-slate-800 min-w-[56px] text-left truncate max-w-[80px]">{projFilter}</span>
                  <span className={`text-slate-400 transition-transform ${projMenuOpen ? "rotate-180" : ""}`}><Icons.ChevronDown /></span>
                </button>
                {projMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-52 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg z-20 py-1">
                    {["All", ...projectOptions].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setProjFilter(opt); setProjMenuOpen(false); }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                          projFilter === opt ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate pr-3">{opt}</span>
                        {projFilter === opt && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-52 shadow-sm">
                <span className="text-slate-400"><Icons.Search /></span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employees…"
                  className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-full"
                />
              </div>

              {/* Add button */}
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
              >
                <Icons.Plus />
                Add Employee
              </button>
            </div>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[32px_2fr_2fr_1.5fr_1.5fr_1.2fr_32px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 items-center">
            {/* Select-all checkbox */}
            <label className="flex items-center cursor-pointer" onClick={toggleAll}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                allSelected
                  ? "bg-indigo-600 border-indigo-600"
                  : someSelected
                  ? "bg-indigo-100 border-indigo-400"
                  : "border-slate-300 bg-white hover:border-indigo-400"
              }`}>
                {allSelected && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                    <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {!allSelected && someSelected && <div className="w-2 h-0.5 bg-indigo-500 rounded-full" />}
              </div>
            </label>
            {["Name", "Projects", "Position", "Manager", "Department"].map((h) => (
              <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</span>
            ))}
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Icons.Users />
              </div>
              <p className="text-sm font-semibold text-slate-500">No employees found</p>
              <p className="text-xs mt-1">{search ? "Try a different search term." : "Add your first employee using the button above."}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {filtered.map((emp, index) => {
                const inits      = getInitials(emp.name || "??");
                const palette    = avatarPalette[index % avatarPalette.length];
                const isSelected = selected.has(emp._id);

                return (
                  <li
                    key={emp._id}
                    className={`grid grid-cols-[32px_2fr_2fr_1.5fr_1.5fr_1.2fr_32px] gap-4 items-center px-6 py-3.5 transition-colors group ${
                      isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Checkbox */}
                    <label className="flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleOne(emp._id); }}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-slate-300 bg-white hover:border-indigo-400 group-hover:border-slate-400"
                      }`}>
                        {isSelected && (
                          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </label>

                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => router.push(`/dashboard/employee-overview/${emp._id}`)}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${palette}`}>
                        {inits}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 truncate">{emp.name}</span>
                    </div>

                    {/* Projects */}
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0 cursor-pointer" onClick={() => router.push(`/dashboard/employee-overview/${emp._id}`)}>
                      {emp.projects.length === 0 ? (
                        <span className="text-xs text-slate-400 font-medium">Unassigned</span>
                      ) : (
                        <>
                          {emp.projects.slice(0, 2).map((p) => (
                            <span key={p} className="truncate rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                              {p}
                            </span>
                          ))}
                          {emp.projects.length > 2 && (
                            <span className="text-[10px] font-semibold text-slate-400">+{emp.projects.length - 2}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Position */}
                    <span className="cursor-pointer" onClick={() => router.push(`/dashboard/employee-overview/${emp._id}`)}>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full truncate max-w-full inline-block">
                        {emp.position}
                      </span>
                    </span>

                    {/* Manager */}
                    <span className="text-xs text-slate-500 font-medium truncate cursor-pointer" onClick={() => router.push(`/dashboard/employee-overview/${emp._id}`)}>
                      {emp.manager || "—"}
                    </span>

                    {/* Department */}
                    <span className="cursor-pointer" onClick={() => router.push(`/dashboard/employee-overview/${emp._id}`)}>
                      {emp.department && emp.department !== "Unassigned" ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full truncate max-w-full inline-block">
                          {emp.department}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">—</span>
                      )}
                    </span>

                    {/* Arrow */}
                    <span className="text-slate-200 group-hover:text-slate-400 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/employee-overview/${emp._id}`)}>
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
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{employees.length}</span> employees
              </p>
              {someSelected && (
                <p className="text-xs text-indigo-600 font-semibold">{selectedCount} selected</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Add Employee Slide Panel ───────────────────────────────────── */}
      <AddEmployeePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAdd={handleAdd}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────────────── */}
      {deleteModal && (
        <DeleteModal
          count={selectedCount}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
}