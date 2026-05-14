"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Send, ArrowLeft } from "lucide-react";
import { logout } from "@/app/utils/logout";
import DepartmentCard from "@/components/knowledge-base/departments/DepartmentCard";
import CreateDepartmentModal from "@/components/knowledge-base/departments/CreateDepartmentModal";
import EmptyState from "@/components/knowledge-base/shared/EmptyState";

interface DeptWithCounts {
  _id: string;
  name: string;
  description?: string;
  color: string;
  moduleCount: number;
  taskCount: number;
}

const KnowledgeBasePage = () => {
  const router = useRouter();
  const [departments, setDepartments] = useState<DeptWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // ── Auth check ─────────────────────────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("role")
      ? JSON.parse(localStorage.getItem("role")!)
      : null;
    const userId = localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId")!)
      : null;
    if (role !== "Admin" || userId !== "69b7a372da8fb747f01f6827") {
      window.location.href = "/unauthorized";
    }
  }, []);

  // ── Fetch departments with counts ──────────────────────────────────
  const fetchDepartments = useCallback(async () => {
    try {
      const [deptRes, modRes, taskRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/modules"),
        fetch("/api/kb-tasks"),
      ]);

      const depts = await deptRes.json();
      const mods = await modRes.json();
      const tasks = await taskRes.json();

      const enriched: DeptWithCounts[] = depts.map((d: any) => ({
        ...d,
        moduleCount: mods.filter((m: any) => m.departmentId === d._id).length,
        taskCount: tasks.filter((t: any) => t.departmentId === d._id).length,
      }));

      setDepartments(enriched);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // ── Delete department ──────────────────────────────────────────────
  const handleDelete = async (departmentId: string) => {
    if (!confirm("Delete this department and all its modules/tasks?")) return;

    try {
      await fetch("/api/departments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId }),
      });
      fetchDepartments();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="border-b border-gray-200 bg-black px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/overview")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-white" />
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Knowledge Base
                </h1>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage departments, modules, and reusable task templates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/knowledge-base/assign")}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Send className="h-3.5 w-3.5" />
              Assign Tasks
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              <Plus className="h-3.5 w-3.5" />
              New Department
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-400">
              Loading departments…
            </span>
          </div>
        ) : departments.length === 0 ? (
          <EmptyState
            title="No departments yet"
            description="Create your first department to start building a reusable knowledge base for your interns."
            actionLabel="Create Department"
            onAction={() => setShowCreate(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                department={dept}
                moduleCount={dept.moduleCount}
                taskCount={dept.taskCount}
                onSelect={() =>
                  router.push(`/knowledge-base/${dept._id}`)
                }
                onDelete={() => handleDelete(dept._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Create Modal ────────────────────────────────────────────── */}
      <CreateDepartmentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchDepartments}
      />
    </div>
  );
};

export default KnowledgeBasePage;
