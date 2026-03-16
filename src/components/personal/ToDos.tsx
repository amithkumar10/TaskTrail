"use client";

import React, { useState, useEffect } from "react";
import { Task as TaskType } from "@/app/models/Tasks";

const userId = JSON.parse(localStorage.getItem("userId") || "null");

const ToDos: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch tasks on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
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
  }, []);

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
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">To-Do List</h2>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* States */}
      {loading && <p className="text-gray-400 text-sm">Loading tasks...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Task List */}
      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-400 text-sm">No tasks yet. Add one above!</p>
      )}

      <ul className="space-y-2">
        {tasks.map((t, idx) => (
          <li
            key={t._id || idx}
            className={`flex justify-between items-center p-2 rounded ${
              t.status === "completed"
                ? "bg-green-100 line-through text-gray-500"
                : "bg-gray-100"
            }`}
          >
            {editingIndex === idx ? (
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(idx)}
                className="flex-1 p-1 border rounded mr-2"
              />
            ) : (
              <div className="flex flex-col">
                <span>{t.name}</span>
                {t.timeSpent !== undefined && (
                  <span className="text-sm text-gray-600">{t.timeSpent} hrs</span>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(idx)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                {t.status === "completed" ? "Undo" : "Done"}
              </button>

              {editingIndex === idx ? (
                <button
                  onClick={() => saveEdit(idx)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(idx)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDos;