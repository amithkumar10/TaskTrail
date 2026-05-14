"use client";

import React from "react";

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
};

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const style = colorMap[priority] || colorMap.medium;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${style.border}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
};

export default PriorityBadge;
