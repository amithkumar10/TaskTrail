"use client";

import React, { useState, useEffect } from "react";
import { Task as TaskType } from "@/app/models/Tasks";

const ToDos: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [timePickerIndex, setTimePickerIndex] = useState<number | null>(null);
  const [hoursSelected, setHoursSelected] = useState<number>(0);
  const [minsSelected, setMinsSelected] = useState<number>(30);
  const [canAddTasks, setCanAddTasks] = useState(false);

  const formatTime = (minutes?: number | null) => {
    if (minutes === undefined || minutes === null) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const syncAttendanceState = () => {
    const savedStatus = localStorage.getItem("attendanceStatus");
    const savedDate = localStorage.getItem("attendanceDate");
    setCanAddTasks(Boolean(savedStatus && savedDate === getTodayDate()));
  };

    useEffect(() => {
    const id = JSON.parse(localStorage.getItem("userId") || "null");
    setUserId(id);
    syncAttendanceState();
  }, []);

  useEffect(() => {
    const handleAttendanceMarked = () => {
      syncAttendanceState();
    };

    window.addEventListener("attendanceMarked", handleAttendanceMarked);
    return () => window.removeEventListener("attendanceMarked", handleAttendanceMarked);
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
    if (!canAddTasks) {
      alert("Please mark attendance for today before adding tasks.");
      return;
    }

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
      setTimePickerIndex(index);
      setHoursSelected(0);
      setMinsSelected(30);
      return;
    } else {
      setTasks((prev) =>
        prev.map((task, i) =>
          i === index ? { ...task, status: "pending", timeSpent: undefined } : task
        )
      );
    }
  };

  const cancelTimePicker = () => {
    setTimePickerIndex(null);
  };

  const confirmTimeForTask = async (index: number) => {
    const t = tasks[index];
    const totalMins = hoursSelected * 60 + minsSelected;
    if (totalMins <= 0) {
      alert("Please select a valid time greater than 0.");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: t._id, timeSpent: totalMins }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        return;
      }

      setTasks((prev) =>
        prev.map((task, i) =>
          i === index ? { ...task, status: "completed", timeSpent: totalMins } : task
        )
      );
      setTimePickerIndex(null);
    } catch (err) {
      alert("Failed to update task.");
      console.error(err);
    }
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
  {!canAddTasks && (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Mark attendance first to enable todo entry.
    </div>
  )}
  <div className="flex gap-2 mb-6">
    <input
      type="text"
      value={task}
      onChange={(e) => setTask(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addTask()}
      placeholder="What needs to be done?"
      disabled={!canAddTasks}
      className="flex-1 bg-white text-gray-900 placeholder-gray-400 text-sm px-4 py-2.5 rounded-xl border border-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    />
    <button
      onClick={addTask}
      disabled={!canAddTasks}
      className="bg-gray-900 cursor-pointer hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 text-sm disabled:cursor-not-allowed disabled:bg-gray-400"
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
            <span className="text-xs text-gray-400 mt-0.5">{formatTime(t.timeSpent)}</span>
          )}
        </div>

        {/* Right: Action buttons */}
        <div className="flex gap-1.5 ml-3 shrink-0 items-center">
          {timePickerIndex === idx ? (
            <div className="flex items-center gap-2 bg-white p-2 rounded-md border">
              <select
                value={hoursSelected}
                onChange={(e) => setHoursSelected(Number(e.target.value))}
                className="text-sm rounded-md border px-2 py-1"
              >
                {Array.from({ length: 13 }).map((_, h) => (
                  <option key={h} value={h}>{h}h</option>
                ))}
              </select>

              <select
                value={minsSelected}
                onChange={(e) => setMinsSelected(Number(e.target.value))}
                className="text-sm rounded-md border px-2 py-1"
              >
                {[0,15,30,45].map((m) => (
                  <option key={m} value={m}>{m}m</option>
                ))}
              </select>

              <button onClick={() => confirmTimeForTask(idx)} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md">Confirm</button>
              <button onClick={cancelTimePicker} className="text-xs bg-white border px-3 py-1.5 rounded-md">Cancel</button>
            </div>
          ) : (
            <>
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
            </>
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