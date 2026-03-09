"use client";

import React, { useState } from "react";

type DayStatus = "Full Day" | "Half Day" | "Work From Home" | "Leave" | "";

const AttendanceSelector: React.FC = () => {
  const [status, setStatus] = useState<DayStatus>("");

  return (
    <div className="p-4 max-w-sm  bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Select Attendance Status</h2>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="attendance"
            value="Full Day"
            checked={status === "Full Day"}
            onChange={(e) => setStatus(e.target.value as DayStatus)}
            className="accent-yellow-600"
          />
          Full Day
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="attendance"
            value="Half Day"
            checked={status === "Half Day"}
            onChange={(e) => setStatus(e.target.value as DayStatus)}
            className="accent-yellow-400"
          />
          Half Day
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="attendance"
            value="Work From Home"
            checked={status === "Work From Home"}
            onChange={(e) => setStatus(e.target.value as DayStatus)}
            className="accent-yellow-500"
          />
          Work From Home
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="attendance"
            value="Leave"
            checked={status === "Leave"}
            onChange={(e) => setStatus(e.target.value as DayStatus)}
            className="accent-gray-500"
          />
          Leave
        </label>
      </div>

      {status && (
        <p className="mt-4 text-gray-700">
          Selected: <span className="font-semibold">{status}</span>
        </p>
      )}
    </div>
  );
};

export default AttendanceSelector;