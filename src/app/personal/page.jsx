"use client"
import React from 'react'
import ToDos from '@/components/personal/ToDos'
import AttendanceSelector from '@/components/personal/AttendanceSelector'
import { useEffect, useState } from 'react'
import { logout } from '@/app/utils/logout'

const page = () => {
  const [letter, setLetter] = useState("U");
  const [fullName, setFullName] = useState("");

  const checkAuthorization = () => {
    const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : null;

    if (role !== "Intern") {
      window.location.href = "/unauthorized";
    }
  };

  useEffect(() => {
      checkAuthorization();
      const nameFromStorage = localStorage.getItem("name")
        ? JSON.parse(localStorage.getItem("name"))
        : localStorage.getItem("username")
        ? JSON.parse(localStorage.getItem("username"))
        : "";

     
      const raw = nameFromStorage || "";
      const cleaned = (typeof raw === "string" ? raw : String(raw)).replace(/@tasktrail\.com$/i, "").trim();

      const displayName = cleaned || "Intern Dashboard";
      const capitalized = displayName
        ? displayName.charAt(0).toUpperCase() + displayName.slice(1)
        : displayName;
      setFullName(capitalized);
      setLetter(capitalized ? capitalized[0].toUpperCase() : "U");
  },[])
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-black px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white flex-shrink-0">
              <span className="text-xs font-semibold text-black">{letter}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate">{fullName || 'Intern Dashboard'}</h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-200 sm:text-sm whitespace-nowrap">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/20 sm:text-xs"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-start sm:px-6 sm:py-8 sm:gap-4">

        {/* Attendance card */}
        <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:w-auto">
          <AttendanceSelector />
        </div>

        {/* Vertical divider */}
        <div className="hidden flex-col items-center gap-2 self-stretch py-2 sm:flex">
          <div className="flex-1 w-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest [writing-mode:vertical-lr]">Tasks</span>
          <div className="flex-1 w-px bg-gray-200" />
        </div>

        {/* Todos card */}
        <div className="w-full flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <ToDos />
        </div>

      </div>
    </div>
  )
}

export default page