"use client";

import React, { useState, useEffect } from "react";
import { Task as TaskType } from "@/app/models/Tasks";

const ToDos: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
    const id = JSON.parse(localStorage.getItem("userId") || "null");
    setUserId(id);
  }, []);

  console.log("Current userId in ToDos:", userId);

  // ─── Fetch tasks on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
       if (!userId) return;
      try {
        const res = await fetch(`/api/tasks?userId=${userId}&&date=${new Date().toISOString().split("T")[0]}`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data: TaskType[] = await res.json();
        setTasks(data);
      } catch (err) {
        setError("Could not load tasks. Please refresh.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // ─── Add task (POST) ────────────────────────────────────────────────────────
  const addTask = async () => {
    if (!task.trim()) return;

    const newTask: Partial<TaskType> = { userId, name: task, status: "pending" };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        return;
      }

      const data = await res.json();
      setTasks((prev) => [
        ...prev,
        { ...newTask, _id: data.taskId, status: "pending" } as TaskType,
      ]);
      setTask("");
    } catch (err) {
      alert("Failed to add task.");
      console.error(err);
    }
  };

  // ─── Toggle completion (PATCH) ──────────────────────────────────────────────
  const toggleTask = async (index: number) => {
    const t = tasks[index];

    // Completing a task → ask for time spent
    if (t.status === "pending") {
      const timeInput = prompt(`How many hours did you spend on "${t.name}"?`);
      const time = Number(timeInput);

      if (isNaN(time) || time <= 0) {
        alert("Invalid input! Task not marked as completed.");
        return;
      }

      try {
        const res = await fetch("/api/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: t._id, timeSpent: time }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(`Error: ${err.error}`);
          return;
        }

        setTasks((prev) =>
          prev.map((task, i) =>
            i === index ? { ...task, status: "completed", timeSpent: time } : task
          )
        );
      } catch (err) {
        alert("Failed to update task.");
        console.error(err);
      }

    // Undoing a task → optimistic local update only (no undo endpoint yet)
    } else {
      setTasks((prev) =>
        prev.map((task, i) =>
          i === index ? { ...task, status: "pending", timeSpent: undefined } : task
        )
      );
    }
  };

  // ─── Edit task (local only — no PUT endpoint yet) ───────────────────────────
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(tasks[index].name);
  };

  const saveEdit = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, name: editingText } : task))
    );
    setEditingIndex(null);
    setEditingText("");
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
   <div className="w-full max-w-md mx-auto p-6">

  {/* Header */}
  <div className="mb-6">
    <p className="text-gray-700 text-xs font-semibold uppercase tracking-[0.2em] mb-1">My Workspace</p>
    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Task Board</h2>
    <p className="text-gray-600 text-sm mt-0.5">{tasks.length} tasks total</p>
  </div>

  {/* Add Task */}
  <div className="flex gap-2 mb-6">
    <input
      type="text"
      value={task}
      onChange={(e) => setTask(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addTask()}
      placeholder="What needs to be done?"
      className="flex-1 bg-white text-gray-900 placeholder-gray-400 text-sm px-4 py-2.5 rounded-xl border border-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all"
    />
    <button
      onClick={addTask}
      className="bg-gray-900 cursor-pointer hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 text-sm"
    >
      Add
    </button>
  </div>

  {/* States */}
  {loading && (
    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
      <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      Loading tasks...
    </div>
  )}
  {error && (
    <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
      {error}
    </div>
  )}

  {/* Empty State */}
  {!loading && !error && tasks.length === 0 && (
    <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
      <p className="text-gray-400 text-sm">No tasks yet. Add one above!</p>
    </div>
  )}

  {/* Task List */}
  <ul className="space-y-2">
    {tasks.map((t, idx) => (
      <li
        key={t._id || idx}
        className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all ${
          t.status === "completed"
            ? "bg-gray-50 border-gray-100"
            : "bg-white border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Left: Task content or edit input */}
        {editingIndex === idx ? (
          <input
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit(idx)}
            className="flex-1 bg-gray-50 text-gray-900 text-sm px-3 py-1.5 rounded-lg border border-gray-400 focus:outline-none mr-3"
          />
        ) : (
          <div className="flex flex-col min-w-0">
            <span
              className={`text-sm font-medium truncate ${
                t.status === "completed"
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {t.name}
            </span>
            {t.timeSpent !== undefined && (
              <span className="text-xs text-gray-400 mt-0.5">{t.timeSpent} hrs</span>
            )}
          </div>
        )}

        {/* Right: Action buttons */}
        <div className="flex gap-1.5 ml-3 shrink-0">
          <button
            onClick={() => toggleTask(idx)}
            className={`text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
              t.status === "completed"
                ? "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                : "bg-gray-900 border-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {t.status === "completed" ? "Undo" : "Done"}
          </button>

          {editingIndex === idx ? (
            <button
              onClick={() => saveEdit(idx)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => startEdit(idx)}
              className="text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all active:scale-95"
            >
              Edit
            </button>
          )}
        </div>
      </li>
    ))}
  </ul>

  {/* Footer count */}
  {tasks.length > 0 && (
    <p className="text-center text-gray-600 text-xs mt-5">
      {tasks.filter(t => t.status === "completed").length} of {tasks.length} completed
    </p>
  )}
</div>
  );
};

export default ToDos;