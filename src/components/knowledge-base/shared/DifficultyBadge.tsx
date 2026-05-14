"use client";

import React from "react";

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  intermediate: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  advanced: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

const icons: Record<string, string> = {
  beginner: "🟢",
  intermediate: "🔵",
  advanced: "🟣",
};

interface DifficultyBadgeProps {
  difficulty: string;
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const style = colorMap[difficulty] || colorMap.beginner;
  const icon = icons[difficulty] || "⚪";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide ${style.bg} ${style.text} ${style.border}`}
    >
      {icon} {difficulty}
    </span>
  );
};

export default DifficultyBadge;
