import React from 'react'
import ToDos from '@/components/personal/ToDos'
import AttendanceSelector from '@/components/personal/AttendanceSelector'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-black px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Intern Dashboard</h1>
            <p className="text-xs text-gray-200 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white flex  items-center justify-center">
            <span className="text-black text-xs font-semibold m-2">U</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 flex gap-4 items-start">

        {/* Attendance card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
          <AttendanceSelector />
        </div>

        {/* Vertical divider */}
        <div className="flex flex-col items-center gap-2 self-stretch py-2">
          <div className="flex-1 w-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest [writing-mode:vertical-lr]">Tasks</span>
          <div className="flex-1 w-px bg-gray-200" />
        </div>

        {/* Todos card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1">
          <ToDos />
        </div>

      </div>
    </div>
  )
}

export default page