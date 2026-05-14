"use client";

import React from "react";
import { Module } from "@/app/models/KnowledgeBase";
import { FolderOpen, Trash2, ChevronRight } from "lucide-react";

interface ModuleCardProps {
  module: Module;
  taskCount: number;
  departmentColor: string;
  onSelect: () => void;
  onDelete: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  taskCount,
  departmentColor,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-gray-300"
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        title="Delete module"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Icon */}
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: departmentColor + "18" }}
      >
        <FolderOpen className="h-5 w-5" style={{ color: departmentColor }} />
      </div>

      {/* Name */}
      <h3 className="text-sm font-bold text-gray-900 mb-1 tracking-tight">
        {module.name}
      </h3>

      {/* Description */}
      {module.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {module.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center text-[11px] text-gray-500 font-medium">
        <span>
          {taskCount} task{taskCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Arrow */}
      <ChevronRight className="absolute right-4 bottom-5 h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500" />
    </div>
  );
};

export default ModuleCard;
