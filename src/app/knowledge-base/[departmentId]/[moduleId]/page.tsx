"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, ArrowLeft, FolderOpen } from "lucide-react";
import { logout } from "@/app/utils/logout";
import { KBTask } from "@/app/models/KnowledgeBase";
import TaskCard from "@/components/knowledge-base/tasks/TaskCard";
import TaskDetailModal from "@/components/knowledge-base/tasks/TaskDetailModal";
import CreateTaskForm from "@/components/knowledge-base/tasks/CreateTaskForm";
import SearchInput from "@/components/knowledge-base/shared/SearchInput";
import EmptyState from "@/components/knowledge-base/shared/EmptyState";

const ModuleDetailPage = () => {
  const router = useRouter();
  const { departmentId, moduleId } = useParams() as { departmentId: string; moduleId: string };

  const [department, setDepartment] = useState<any>(null);
  const [mod, setMod] = useState<any>(null);
  const [tasks, setTasks] = useState<KBTask[]>([]);
  const [filtered, setFiltered] = useState<KBTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<KBTask | null>(null);
  const [editTask, setEditTask] = useState<KBTask | null>(null);
  const [pFilter, setPFilter] = useState("");
  const [dFilter, setDFilter] = useState("");
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")!) : null;
    const userId = localStorage.getItem("userId") ? JSON.parse(localStorage.getItem("userId")!) : null;
    if (role !== "Admin" || userId !== "69b7a372da8fb747f01f6827") window.location.href = "/unauthorized";
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [dr, mr, tr] = await Promise.all([
        fetch("/api/departments"), fetch(`/api/modules?departmentId=${departmentId}`), fetch(`/api/kb-tasks?moduleId=${moduleId}`),
      ]);
      const depts = await dr.json(); const mods = await mr.json(); const t = await tr.json();
      setDepartment(depts.find((d: any) => d._id === departmentId) || null);
      setMod(mods.find((m: any) => m._id === moduleId) || null);
      setTasks(t); setFiltered(t);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [departmentId, moduleId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    let r = [...tasks];
    if (searchQ) { const q = searchQ.toLowerCase(); r = r.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tags?.some(tag => tag.toLowerCase().includes(q))); }
    if (pFilter) r = r.filter(t => t.priority === pFilter);
    if (dFilter) r = r.filter(t => t.difficulty === dFilter);
    setFiltered(r);
  }, [tasks, searchQ, pFilter, dFilter]);

  const handleDelete = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    try { await fetch("/api/kb-tasks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId }) }); fetchData(); } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-black px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push(`/knowledge-base/${departmentId}`)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><ArrowLeft className="h-4 w-4" /></button>
            <div className="flex items-center gap-3">
              {department && <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: department.color + "30" }}><FolderOpen className="h-5 w-5" style={{ color: department.color }} /></div>}
              <div><h1 className="text-lg font-bold text-white tracking-tight">{mod?.name || "Module"}</h1><p className="text-xs text-gray-400 mt-0.5">{mod?.description || "Task repository"}</p></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-100"><Plus className="h-3.5 w-3.5" />New Task</button>
            <button onClick={logout} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/20">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button onClick={() => router.push("/knowledge-base")} className="hover:text-gray-600">Knowledge Base</button><span>/</span>
          <button onClick={() => router.push(`/knowledge-base/${departmentId}`)} className="hover:text-gray-600">{department?.name}</button><span>/</span>
          <span className="text-gray-700 font-medium">{mod?.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[200px]"><SearchInput placeholder="Search tasks…" onSearch={setSearchQ} /></div>
          <select value={pFilter} onChange={e => setPFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none"><option value="">All Priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
          <select value={dFilter} onChange={e => setDFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 outline-none"><option value="">All Difficulties</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
          <span className="text-xs text-gray-400 font-medium">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /><span className="ml-3 text-sm text-gray-400">Loading…</span></div>
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Create your first reusable task template." actionLabel="Create Task" onAction={() => setShowCreate(true)} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12"><p className="text-sm text-gray-400">No tasks match your filters.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(task => <TaskCard key={task._id} task={task} onSelect={() => setSelectedTask(task)} onDelete={() => handleDelete(task._id!)} />)}
          </div>
        )}
      </main>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onEdit={(task) => { setEditTask(task); setShowCreate(true); }} />
      <CreateTaskForm open={showCreate} departmentId={departmentId} moduleId={moduleId} onClose={() => { setShowCreate(false); setEditTask(null); }} onCreated={fetchData} editTask={editTask} />
    </div>
  );
};

export default ModuleDetailPage;
