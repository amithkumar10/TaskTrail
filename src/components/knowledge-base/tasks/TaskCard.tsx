"use client";

import React from "react";
import { KBTask } from "@/app/models/KnowledgeBase";
import PriorityBadge from "../shared/PriorityBadge";
import DifficultyBadge from "../shared/DifficultyBadge";
import TagPill from "../shared/TagPill";
import { Clock, BookOpen, Paperclip, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: KBTask;
  onSelect: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onDelete }) => {
  return (
    <div
      onClick={onSelect}
      className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300"
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        title="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Title */}
      <h3 className="text-sm font-bold text-gray-900 mb-2 pr-8 tracking-tight line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        <DifficultyBadge difficulty={task.difficulty} />
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.slice(0, 4).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {task.tags.length > 4 && (
            <span className="text-[11px] text-gray-400">
              +{task.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {task.expectedDays} day{task.expectedDays !== 1 ? "s" : ""}
        </span>
        {task.resources && task.resources.length > 0 && (
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {task.resources.length} resource
            {task.resources.length !== 1 ? "s" : ""}
          </span>
        )}
        {task.attachments && task.attachments.length > 0 && (
          <span className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            {task.attachments.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
