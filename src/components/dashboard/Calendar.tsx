"use client";

import { useState, useEffect } from "react";
import axios from "@/app/utils/axiosConfig";
import { useParams } from "next/navigation";

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const toDateStr = (year: number, month: number, day: number) => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [attendance, setAttendance] = useState<string[]>([]);
  const userId = useParams().internId;


  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const days: (number | null)[] = [];
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const totalDays = daysInMonth(currentMonth, currentYear);

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return days;
  };

 
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
      
        const monthStr = toDateStr(currentYear, currentMonth, 1);
        console.log("Fetching attendance for:", { userId, monthStr });

        const res = await fetch(
          `/api/attendance?userId=${userId}&date=${monthStr}`
        );

        const data = await res.json();
        setAttendance(data.data || []);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };

    fetchAttendance();
  }, [currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    onDateSelect(toDateStr(currentYear, currentMonth, day));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Full Day":
        return "bg-gradient-to-r from-yellow-800 to-yellow-600 text-white";
      case "WFH":
        return "bg-gradient-to-r from-yellow-500 to-yellow-300";
      case "Half Day":
        return "bg-gradient-to-r from-yellow-200 to-yellow-100";
      case "Leave":
        return "bg-white border border-gray-500";
      default:
        return "bg-gray-100"; // Absent
    }
  };

  const calendarDays = generateCalendar();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4 max-w-full bg-white shadow rounded">
      {/* Header */}
      <div className="flex bg-black p-3 text-white justify-between items-center mb-4">
        <button className="cursor-pointer" onClick={prevMonth}>
          &lt;
        </button>
        <h2 className="font-bold text-lg">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
        <button className="cursor-pointer" onClick={nextMonth}>
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 cursor-pointer gap-1 text-center mt-2">
        {calendarDays.map((day, index) => {
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const thisDateStr = day
            ? toDateStr(currentYear, currentMonth, day)
            : null;

          const isSelected = thisDateStr === selectedDate;

          const status = day ? attendance[day - 1] : null;

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`p-2 border rounded transition-all ${
                status ? getStatusClass(status) : ""
              } ${
                isSelected
                  ? "ring-2 ring-blue-500"
                  : isToday
                  ? "bg-blue-200"
                  : ""
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;