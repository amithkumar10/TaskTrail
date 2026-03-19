"use client";

import React, { useState, useEffect } from "react";
import axios from "@/app/utils/axiosConfig";

type DayStatus = "Full Day" | "Half Day" | "WFH" | "Leave" | "";

const AttendanceSelector: React.FC = () => {
  const [status, setStatus] = useState<DayStatus>("");
  const [locked, setLocked] = useState(false);

  const userId = JSON.parse(localStorage.getItem("userId") || "null");
  console.log("AttendanceSelector userId:", userId);


  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Optional: lock if already marked (on reload)
  useEffect(() => {
    const saved = localStorage.getItem("attendanceStatus");
    const savedDate = localStorage.getItem("attendanceDate");

    if (saved && savedDate === getTodayDate()) {
      setStatus(saved as DayStatus);
      setLocked(true);
    }
  }, []);

  console.log("Today Date", getTodayDate());

  const handleStatusChange = async (value: DayStatus) => {
    if (locked) return;


    const confirm = window.confirm(`Mark attendance as "${value}"?`);
    if (!confirm) return;

    try {
      const todayDate = getTodayDate();

      const res = await axios.post("/attendance", {
        status: value,
        date: todayDate,
        userId,
      });

      if (res.status === 200) {
        setStatus(value);
        setLocked(true);

        // ✅ Persist lock for today
        localStorage.setItem("attendanceStatus", value);
        localStorage.setItem("attendanceDate", todayDate);

        console.log("Attendance updated successfully");
      }
    } catch (error: any) {
      console.error("Failed to update attendance", error?.response?.data);
    }
  };

  const options: { value: DayStatus; label: string; hint: string }[] = [
    { value: "Full Day", label: "Full Day", hint: "8 hrs" },
    { value: "Half Day", label: "Half Day", hint: "5 hrs" },
    { value: "WFH", label: "WFH", hint: "Remote" },
    { value: "Leave", label: "Leave", hint: "Absent" },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-6">
        <p className="text-gray-800 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
          Daily Log
        </p>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Attendance
        </h2>
        <p className="text-gray-600 text-sm mt-0.5">
          Mark your status for today
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map(({ value, label, hint }) => (
          <label
            key={value}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
              status === value
                ? "bg-gray-900 border-gray-900"
                : "bg-white border-gray-200"
            } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-gray-300"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  status === value ? "border-white" : "border-gray-300"
                }`}
              >
                {status === value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              <span
                className={`text-sm font-medium ${
                  status === value ? "text-white" : "text-gray-800"
                }`}
              >
                {label}
              </span>
            </div>

            <span className="text-xs font-medium text-gray-400">
              {hint}
            </span>

            <input
              type="radio"
              name="attendance"
              value={value}
              checked={status === value}
              onChange={() => handleStatusChange(value)}
              disabled={locked} // ✅ lock UI
              className="sr-only"
            />
          </label>
        ))}
      </div>

      {status ? (
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Selected
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {status}
          </span>
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-600 text-xs">
          No status selected yet
        </p>
      )}
    </div>
  );
};

export default AttendanceSelector;