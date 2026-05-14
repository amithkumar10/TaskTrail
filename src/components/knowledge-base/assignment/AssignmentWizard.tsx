"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Send, CheckCircle, Loader2 } from "lucide-react";

interface InternItem {
  _id: string;
  name: string;
  email?: string;
  position?: string;
}

interface DeptItem {
  _id: string;
  name: string;
  color: string;
}

interface ModuleItem {
  _id: string;
  name: string;
  departmentId: string;
}

interface TaskItem {
  _id: string;
  title: string;
  priority: string;
  difficulty: string;
  expectedDays: number;
  resources?: any[];
}

const STEPS = [
  "Select Department",
  "Select Module",
  "Select Tasks",
  "Select Interns",
  "Review & Send",
];

const AssignmentWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Data
  const [departments, setDepartments] = useState<DeptItem[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [interns, setInterns] = useState<InternItem[]>([]);

  // Selections
  const [selectedDept, setSelectedDept] = useState<DeptItem | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [selectedInternIds, setSelectedInternIds] = useState<Set<string>>(new Set());
  const [deadlineDays, setDeadlineDays] = useState<number>(7);

  // Status
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // ── Fetch departments on mount ─────────────────────────────────────
  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then(setDepartments)
      .catch(console.error);
  }, []);

  // ── Fetch modules when department changes ──────────────────────────
  useEffect(() => {
    if (!selectedDept) return;
    setLoading(true);
    fetch(`/api/modules?departmentId=${selectedDept._id}`)
      .then((r) => r.json())
      .then((data) => {
        setModules(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDept]);

  // ── Fetch tasks when module changes ────────────────────────────────
  useEffect(() => {
    if (!selectedModule) return;
    setLoading(true);
    fetch(`/api/kb-tasks?moduleId=${selectedModule._id}`)
      .then((r) => r.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedModule]);

  // ── Fetch interns when reaching step 3 ─────────────────────────────
  useEffect(() => {
    if (step !== 3) return;
    setLoading(true);
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setInterns(data.filter((u: any) => u.role === "Intern"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [step]);

  // ── Toggle helpers ─────────────────────────────────────────────────
  const toggleTask = (id: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleIntern = (id: string) => {
    setSelectedInternIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllTasks = () => {
    if (selectedTaskIds.size === tasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(tasks.map((t) => t._id)));
    }
  };

  const selectAllInterns = () => {
    if (selectedInternIds.size === interns.length) {
      setSelectedInternIds(new Set());
    } else {
      setSelectedInternIds(new Set(interns.map((i) => i._id)));
    }
  };

  // ── Can proceed? ───────────────────────────────────────────────────
  const canProceed = () => {
    switch (step) {
      case 0:
        return !!selectedDept;
      case 1:
        return !!selectedModule;
      case 2:
        return selectedTaskIds.size > 0;
      case 3:
        return selectedInternIds.size > 0;
      default:
        return true;
    }
  };

  // ── Send assignments ───────────────────────────────────────────────
  const handleSend = async () => {
    setSending(true);
    try {
      const taskIds = Array.from(selectedTaskIds);
      const internIds = Array.from(selectedInternIds);

      // 1. Create assignments
      await fetch("/api/task-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIds,
          internIds,
          departmentId: selectedDept?._id,
          moduleId: selectedModule?._id,
          deadlineDays,
        }),
      });

      // 2. Send emails
      await fetch("/api/send-task-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIds,
          internIds,
          departmentName: selectedDept?.name,
          moduleName: selectedModule?.name,
          deadlineDays,
        }),
      });

      setDone(true);
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Done screen ────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tasks Assigned!</h2>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
          {selectedTaskIds.size} task(s) assigned to {selectedInternIds.size} intern(s).
          Email notifications have been sent.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setDone(false);
              setStep(0);
              setSelectedDept(null);
              setSelectedModule(null);
              setSelectedTaskIds(new Set());
              setSelectedInternIds(new Set());
            }}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Assign More
          </button>
          <button
            onClick={() => router.push("/knowledge-base")}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Back to Knowledge Base
          </button>

           <button
            onClick={() => router.push("/overview")}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Step renderers ─────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((d) => (
              <button
                key={d._id}
                onClick={() => setSelectedDept(d)}
                className={`text-left rounded-xl border-2 p-4 transition-all ${
                  selectedDept?._id === d._id
                    ? "border-gray-900 bg-gray-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {d.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        );

      case 1:
        return loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading modules…
          </div>
        ) : modules.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No modules in this department yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((m) => (
              <button
                key={m._id}
                onClick={() => setSelectedModule(m)}
                className={`text-left rounded-xl border-2 p-4 transition-all ${
                  selectedModule?._id === m._id
                    ? "border-gray-900 bg-gray-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-sm font-semibold text-gray-900">
                  {m.name}
                </span>
              </button>
            ))}
          </div>
        );

      case 2:
        return loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading tasks…
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No tasks in this module yet.
          </p>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500 font-medium">
                {selectedTaskIds.size} of {tasks.length} selected
              </span>
              <button
                onClick={selectAllTasks}
                className="text-xs font-semibold text-gray-900 hover:underline"
              >
                {selectedTaskIds.size === tasks.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {tasks.map((t) => (
                <label
                  key={t._id}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedTaskIds.has(t._id)
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.has(t._id)}
                    onChange={() => toggleTask(t._id)}
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {t.title}
                    </p>
                    <div className="flex gap-3 text-[11px] text-gray-400 mt-0.5">
                      <span className="capitalize">{t.priority}</span>
                      <span className="capitalize">{t.difficulty}</span>
                      <span>{t.expectedDays}d</span>
                      {t.resources && t.resources.length > 0 && (
                        <span>{t.resources.length} resource(s)</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 3:
        return loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading interns…
          </div>
        ) : interns.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No interns found.
          </p>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500 font-medium">
                {selectedInternIds.size} of {interns.length} selected
              </span>
              <button
                onClick={selectAllInterns}
                className="text-xs font-semibold text-gray-900 hover:underline"
              >
                {selectedInternIds.size === interns.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {interns.map((intern) => (
                <label
                  key={intern._id}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedInternIds.has(intern._id)
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedInternIds.has(intern._id)}
                    onChange={() => toggleIntern(intern._id)}
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {(intern.name || "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {intern.name}
                      </p>
                      {intern.email && (
                        <p className="text-xs text-gray-400 truncate">{intern.email}</p>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Department
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedDept?.name}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Module
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedModule?.name}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Tasks
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedTaskIds.size} selected
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Interns
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedInternIds.size} selected
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Deadline (days from now)
              </label>
              <input
                type="number"
                min={1}
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Number(e.target.value))}
                className="mt-1.5 w-32 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              />
            </div>

            {/* Task names */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tasks to assign
              </p>
              <ul className="space-y-1">
                {tasks
                  .filter((t) => selectedTaskIds.has(t._id))
                  .map((t) => (
                    <li key={t._id} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                      {t.title}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Intern names */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Interns receiving assignment
              </p>
              <ul className="space-y-1">
                {interns
                  .filter((i) => selectedInternIds.has(i._id))
                  .map((i) => (
                    <li key={i._id} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                      {i.name} {i.email ? `(${i.email})` : ""}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                i === step
                  ? "bg-gray-900 text-white"
                  : i < step
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px w-4 sm:w-8 bg-gray-200 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step title */}
      <h2 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
        {STEPS[step]}
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        {step === 0 && "Choose the department this assignment belongs to."}
        {step === 1 && "Choose the module / domain within the department."}
        {step === 2 && "Select one or more tasks to assign."}
        {step === 3 && "Select interns who will receive these tasks."}
        {step === 4 && "Review your selections before sending."}
      </p>

      {/* Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Assign & Send Emails
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentWizard;
