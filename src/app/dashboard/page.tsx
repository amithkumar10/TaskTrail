"use client"

import React, { useState } from 'react'
import Calendar from '@/components/dashboard/Calendar'
import TaskPanel from '@/components/dashboard/TaskPanel'
import Representation from '@/components/dashboard/Representation'
import Download from '@/components/dashboard/Download'

const toDateStr = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
};

const page = () => {
  const [selectedDate, setSelectedDate] = useState<string>(toDateStr(new Date()));

  return (
    <div className="flex h-screen" style={{ backgroundImage: "url('')" }}>

      {/* Calendar */}
      <div className="w-[40%] p-6 flex flex-col gap-6">
        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        <Representation />
        <Download />
      </div>

      {/* Task Panel */}
      <div>
        <TaskPanel selectedDate={selectedDate} />
      </div>

    </div>
  )
}

export default page