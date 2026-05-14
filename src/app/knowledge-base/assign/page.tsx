"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { logout } from "@/app/utils/logout";
import AssignmentWizard from "@/components/knowledge-base/assignment/AssignmentWizard";

const AssignPage = () => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")!) : null;
    const userId = localStorage.getItem("userId") ? JSON.parse(localStorage.getItem("userId")!) : null;
    if (role !== "Admin" || userId !== "69b7a372da8fb747f01f6827") window.location.href = "/unauthorized";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-black px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/knowledge-base")} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-white" />
                <h1 className="text-lg font-bold text-white tracking-tight">Assign Tasks</h1>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Select tasks and interns to send assignments with resources</p>
            </div>
          </div>
          <button onClick={logout} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/20">Logout</button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button onClick={() => router.push("/knowledge-base")} className="hover:text-gray-600">Knowledge Base</button>
          <span>/</span>
          <span className="text-gray-700 font-medium">Assign Tasks</span>
        </div>
        <AssignmentWizard />
      </main>
    </div>
  );
};

export default AssignPage;
