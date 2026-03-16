"use client";

import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ProfileCard from "./Profile";
import { Task } from "@/app/models/Tasks";
import { useParams } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend);



const COLORS = [
  "rgba(255, 206, 86, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(255, 99, 132, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
];

interface TaskPanelProps {
  selectedDate: string; // "YYYY-MM-DD"
}

const TaskPanel: React.FC<TaskPanelProps> = ({ selectedDate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useParams().internId; 

  // Re-fetch whenever selectedDate changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tasks?userId=${userId}&date=${selectedDate}`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data: Task[] = await res.json();
        setTasks(data);
      } catch (err) {
        setError("Could not load tasks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]); // 👈 key change — reruns on every date click

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const pieEligible = completedTasks.filter((t) => t.timeSpent !== undefined);

  const pieData = {
    labels: pieEligible.map((t) => t.name),
    datasets: [
      {
        label: "Time Spent (hrs)",
        data: pieEligible.map((t) => t.timeSpent),
        backgroundColor: pieEligible.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex w-full min-h-screen gap-6 p-6">
      {/* Pie Chart */}
      <div className="w-100 bg-white rounded shadow pt-4">
        <div className="p-2 mb-10 bg-black rounded mb-3">
          <h2 className="text-lg text-white font-bold mb-2">Time Spent on Tasks</h2>
          <p className="text-gray-300 text-sm">{selectedDate}</p>
        </div>
        {pieEligible.length > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p className="text-gray-400 text-sm text-center px-4">
            No completed tasks with time tracked yet.
          </p>
        )}
      </div>

      {/* Tasks List */}
      <div className="w-full bg-white rounded shadow p-4">
        <ProfileCard />

        <div className="p-3 bg-black rounded-md mb-3">
          <h2 className="text-lg text-white font-bold mb-2">Tasks Allocated</h2>
        </div>
        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="text-gray-400 text-sm">No tasks for {selectedDate}.</p>
        )}
        <ul className="list-disc list-inside space-y-1">
          {tasks.map((t) => <li key={t._id}>{t.name}</li>)}
        </ul>

        <div className="p-3 bg-black rounded-md mt-5 mb-3">
          <h2 className="text-lg text-white font-bold mb-2">Tasks Completed</h2>
        </div>
        {!loading && completedTasks.length === 0 && (
          <p className="text-gray-400 text-sm">No completed tasks yet.</p>
        )}
        <ul className="list-disc list-inside space-y-1">
          {completedTasks.map((t) => (
            <li key={t._id}>
              {t.name}
              {t.timeSpent !== undefined && (
                <span className="text-sm text-gray-500 ml-2">({t.timeSpent} hrs)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskPanel;