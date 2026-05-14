"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useTheme } from "../providers";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  ),
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const checkAuthorization = () => {
    const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : null;
    if (!role) {
      window.location.href = "/signin";
    }
  };

  useEffect(() => {
    checkAuthorization();
    
    setLoading(false);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    toggleTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <main className="ml-56 flex-1 px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm mt-1 text-slate-400 dark:text-slate-400">
              Manage your preferences and application settings.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200">
              AD
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-800">
          
          {/* Card Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
              <Icons.Settings />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                Appearance
              </p>
              <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-400">
                Customize how the application looks
              </p>
            </div>
          </div>

          {/* Theme Options */}
          <div className={`px-6 py-6 space-y-6`}>
            
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-bold mb-4 text-slate-800 dark:text-white">
                Theme
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Light Theme Option */}
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    theme === "light"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-500"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Icons.Sun />
                    <span className={`font-semibold ${
                      theme === "light"
                        ? "text-indigo-600"
                        : "text-slate-900 dark:text-slate-200"
                    }`}>
                      Light
                    </span>
                  </div>
                  <p className={`text-xs text-center ${
                    theme === "light"
                      ? "text-indigo-500"
                      : "text-slate-500 dark:text-slate-400"
                  }`}>
                    Bright and clean interface
                  </p>
                  {theme === "light" && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </button>

                {/* Dark Theme Option */}
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    theme === "dark"
                      ? "border-indigo-500 bg-slate-700 dark:bg-slate-700"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Icons.Moon />
                    <span className={`font-semibold ${
                      theme === "dark"
                        ? "text-indigo-400"
                        : "text-slate-900 dark:text-slate-200"
                    }`}>
                      Dark
                    </span>
                  </div>
                  <p className={`text-xs text-center ${
                    theme === "dark"
                      ? "text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}>
                    Easy on the eyes
                  </p>
                  {theme === "dark" && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-slate-700 dark:border-slate-600">
              <p className="text-xs text-blue-800 dark:text-slate-300">
                💡 Your theme preference will be saved automatically and applied when you return.
              </p>
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setPasswordOpen((open) => !open)}
            aria-expanded={passwordOpen}
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left border-b border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                <Icons.Lock />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  Security
                </p>
                <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-400">
                  Update the admin password for this account
                </p>
              </div>
            </div>
            <span className={`text-slate-400 transition-transform duration-200 ${passwordOpen ? "rotate-180" : ""}`}>
              <Icons.ChevronDown />
            </span>
          </button>

          {passwordOpen && (
            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-white">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-white">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-white">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/60">
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Password changes are UI-only for now.
                </p>
                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
