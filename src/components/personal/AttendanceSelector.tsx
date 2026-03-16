"use client";

import React, { useState } from "react";

type DayStatus = "Full Day" | "Half Day" | "WFH" | "Leave" | "";

const AttendanceSelector: React.FC = () => {
  const [status, setStatus] = useState<DayStatus>("");

  const options: { value: DayStatus; label: string; hint: string }[] = [
    { value: "Full Day", label: "Full Day", hint: "8 hrs" },
    { value: "Half Day", label: "Half Day", hint: "4 hrs" },
    { value: "WFH", label: "WFH", hint: "Remote" },
    { value: "Leave", label: "Leave", hint: "Absent" },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-800 text-xs font-semibold uppercase tracking-[0.2em] mb-1">Daily Log</p>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h2>
        <p className="text-gray-600 text-sm mt-0.5">Mark your status for today</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map(({ value, label, hint }) => (
          <label
            key={value}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all group ${
              status === value
                ? "bg-gray-900 border-gray-900"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Custom radio */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                status === value
                  ? "border-white"
                  : "border-gray-300 group-hover:border-gray-400"
              }`}>
                {status === value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${
                status === value ? "text-white" : "text-gray-800"
              }`}>
                {label}
              </span>
            </div>

            <span className={`text-xs font-medium transition-colors ${
              status === value ? "text-gray-400" : "text-gray-400"
            }`}>
              {hint}
            </span>

            {/* Hidden native radio */}
            <input
              type="radio"
              name="attendance"
              value={value}
              checked={status === value}
              onChange={(e) => setStatus(e.target.value as DayStatus)}
              className="sr-only"
            />
          </label>
        ))}
      </div>

      {/* Selected status */}
      {status ? (
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Selected</span>
          <span className="text-sm font-semibold text-gray-900">{status}</span>
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-600 text-xs">No status selected yet</p>
      )}
    </div>
  );
};

export default AttendanceSelector;