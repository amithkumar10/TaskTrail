"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, ArrowLeft, Layers } from "lucide-react";
import { logout } from "@/app/utils/logout";
import ModuleCard from "@/components/knowledge-base/modules/ModuleCard";
import CreateModuleModal from "@/components/knowledge-base/modules/CreateModuleModal";
import EmptyState from "@/components/knowledge-base/shared/EmptyState";

interface DeptData {
  _id: string;
  name: string;
  description?: string;
  color: string;
}

interface ModuleWithCount {
  _id: string;
  name: string;
  description?: string;
  departmentId: string;
  taskCount: number;
}

const DepartmentDetailPage = () => {
  const router = useRouter();
  const { departmentId } = useParams() as { departmentId: string };

  const [department, setDepartment] = useState<DeptData | null>(null);
  const [modules, setModules] = useState<ModuleWithCount[]>([]);
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

  // ── Fetch data ─────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [deptRes, modRes, taskRes] = await Promise.all([
        fetch("/api/departments"),
        fetch(`/api/modules?departmentId=${departmentId}`),
        fetch(`/api/kb-tasks?departmentId=${departmentId}`),
      ]);

      const depts = await deptRes.json();
      const mods = await modRes.json();
      const tasks = await taskRes.json();

      const dept = depts.find((d: any) => d._id === departmentId);
      setDepartment(dept || null);

      const enriched: ModuleWithCount[] = mods.map((m: any) => ({
        ...m,
        taskCount: tasks.filter((t: any) => t.moduleId === m._id).length,
      }));

      setModules(enriched);
    } catch (err) {
      console.error("Failed to fetch department data:", err);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Delete module ──────────────────────────────────────────────────
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its tasks?")) return;
    try {
      await fetch("/api/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });
      fetchData();
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
              onClick={() => router.push("/knowledge-base")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              {department && (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: department.color + "30" }}
                >
                  <Layers
                    className="h-4.5 w-4.5"
                    style={{ color: department.color }}
                  />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {department?.name || "Department"}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {department?.description || "Manage modules and tasks"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              <Plus className="h-3.5 w-3.5" />
              New Module
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button
            onClick={() => router.push("/knowledge-base")}
            className="hover:text-gray-600 transition-colors"
          >
            Knowledge Base
          </button>
          <span>/</span>
          <span className="text-gray-700 font-medium">
            {department?.name}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-400">
              Loading modules…
            </span>
          </div>
        ) : modules.length === 0 ? (
          <EmptyState
            title="No modules yet"
            description="Create your first module to start organising tasks within this department."
            actionLabel="Create Module"
            onAction={() => setShowCreate(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod) => (
              <ModuleCard
                key={mod._id}
                module={mod}
                taskCount={mod.taskCount}
                departmentColor={department?.color || "#6366f1"}
                onSelect={() =>
                  router.push(
                    `/knowledge-base/${departmentId}/${mod._id}`
                  )
                }
                onDelete={() => handleDeleteModule(mod._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Create Modal ────────────────────────────────────────────── */}
      <CreateModuleModal
        open={showCreate}
        departmentId={departmentId}
        onClose={() => setShowCreate(false)}
        onCreated={fetchData}
      />
    </div>
  );
};

export default DepartmentDetailPage;
