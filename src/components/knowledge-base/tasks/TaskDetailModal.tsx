"use client";

import React from "react";
import { KBTask } from "@/app/models/KnowledgeBase";
import PriorityBadge from "../shared/PriorityBadge";
import DifficultyBadge from "../shared/DifficultyBadge";
import TagPill from "../shared/TagPill";
import ResourceItem from "./ResourceItem";
import { X, Clock, Calendar, Pencil } from "lucide-react";

interface TaskDetailModalProps {
  task: KBTask | null;
  onClose: () => void;
  onEdit?: (task: KBTask) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onEdit }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 bg-gray-900 px-6 py-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white tracking-tight mb-1">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} />
              <DifficultyBadge difficulty={task.difficulty} />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(task);
                  onClose();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Edit task"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Meta row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                Expected: <strong>{task.expectedDays}</strong> day
                {task.expectedDays !== 1 ? "s" : ""}
              </span>
            </div>
            {task.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Created:{" "}
                  {new Date(task.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </div>
          )}

          {/* Learning Resources */}
          {task.resources && task.resources.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Learning Resources ({task.resources.length})
              </h3>
              <div className="space-y-2">
                {task.resources.map((res, i) => (
                  <ResourceItem key={i} resource={res} />
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Attachments
              </h3>
              <div className="space-y-1">
                {task.attachments.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline truncate"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Edit button at bottom */}
          {onEdit && (
            <button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white active:scale-[0.98]"
            >
              ✏️ Edit This Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
