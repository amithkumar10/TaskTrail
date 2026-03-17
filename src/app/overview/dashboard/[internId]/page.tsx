"use client"

import React, { useEffect, useState } from 'react'
import Calendar from '@/components/dashboard/Calendar'
import TaskPanel from '@/components/dashboard/TaskPanel'
import Representation from '@/components/dashboard/Representation'
import Download from '@/components/dashboard/Download'
import axios from '@/app/utils/axiosConfig'
import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';





const toDateStr = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
};

const checkAuthorization = () => {
  const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")!) : null;
  if (role !== "Admin") {
    window.location.href = "/unauthorized";
  }
};

const page = () => {
  const [selectedDate, setSelectedDate] = useState<string>(toDateStr(new Date()));
  const [interns, setInterns] = useState([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthorization();
    fetchInterns();
  }, [interns.length]);

  const fetchInterns = async () => {
    try {
      const res = await axios.get("/users");
      console.log("Fetched users:", res.data);
      setInterns(res.data?.filter((u: any) => u.role === "Intern") );
    } catch (err) {
      console.error("Failed to fetch interns", err);
    }
  };

  const handleEndInternship = async (userId: string) => {
    if (confirmId !== userId) {
      setConfirmId(userId);
      return;
    }
    try {
      setLoadingId(userId);
      await axios.delete(`/interns/${userId}`);
      setInterns((prev) => prev.filter((i) => i.userId !== userId));
    } catch (err) {
      console.error("Failed to end internship", err);
    } finally {
      setLoadingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Collapsible Sidebar */}
   <aside
  className={`relative flex flex-col shrink-0 transition-all duration-300 ease-in-out
    ${sidebarOpen ? "w-64" : "w-14"} bg-gray-50 border-r border-gray-200 shadow-lg`}
>
  {/* Header */}
  <div
    className={`flex items-center gap-3 px-4 py-4
      ${sidebarOpen ? "justify-between" : "justify-center"} bg-black text-white`}
  >
    {sidebarOpen && (
      <div>
        <h2 className="text-sm font-semibold tracking-widest uppercase">View All Interns</h2>
      </div>
    )}
    <button
      onClick={() => { setSidebarOpen(!sidebarOpen); setConfirmId(null); }}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white  transition-colors shrink-0"
    >
      <span className="text-xs font-bold cursor-pointer bg-black"><PanelLeft className='bg-black text-white' /></span>
    </button>
  </div>

  {/* Intern List */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
    {interns.length === 0 ? (
      sidebarOpen && (
        <p className="text-xs text-gray-400 text-center mt-8 px-4">Loading...</p>
      )
    ) : (
      interns.map((intern) => (
        <div
          key={intern.userId}
          className={`mx-3 my-1 rounded-xl transition-all hover:shadow-md group
            ${sidebarOpen ? "px-4 py-3 bg-white" : "px-1 py-2 flex justify-center"}`}
        >
          {sidebarOpen ? (
            <>
              {/* Expanded: Avatar + Name + Button */}
              <div className="flex items-center cursor-pointer gap-3 mb-2 " onClick={()=>router.push(`/overview/dashboard/${intern._id}`)}>
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {intern.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{intern.username}</p>
                  {intern.email && (
                    <p className="text-xs text-gray-500 truncate">{intern.email}</p>
                  )}
                </div>
              </div>

              {confirmId === intern.userId ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEndInternship(intern.userId)}
                    disabled={loadingId === intern.userId}
                    className="flex-1 text-xs py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {loadingId === intern.userId ? "Ending..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="flex-1 text-xs py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEndInternship(intern.userId)}
                  className="w-full text-xs py-2 rounded-lg bg-gray-100 cursor-pointer text-gray-700 font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  End Internship
                </button>
              )}
            </>
          ) : (
            /* Collapsed: Avatar only with tooltip */
            <div className="relative group/tip" >
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold cursor-pointer" onClick={()=>router.push(`/overview/dashboard/${intern._id}`)}>
                {intern.username.charAt(0).toUpperCase()}
              </div>
              {/* Tooltip */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 z-50 hidden group-hover/tip:flex
                items-center bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                {intern.username}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rotate-45" />
              </div>
            </div>
          )}
        </div>
      ))
    )}
  </div>

  {/* Footer badge */}
  {sidebarOpen && (
    <div className="px-4 py-3 border-t border-gray-100 bg-black">
      <p className="text-xs text-indigo-200 text-center tracking-wide">
        TaskTrail <span className="text-white font-semibold">Admin</span>
      </p>
    </div>
  )}
</aside>

      {/* Calendar + Widgets */}
      <div className="w-[38%] p-6 flex flex-col gap-6 overflow-y-auto">
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        <Representation />
        <Download />
      </div>

      {/* Task Panel */}
      <div className="flex-1 overflow-y-auto">
        <TaskPanel selectedDate={selectedDate} />
      </div>

    </div>
  )
}

export default page