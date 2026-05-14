"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { ResourceType, LearningResource, KBTask } from "@/app/models/KnowledgeBase";

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "documentation", label: "Documentation" },
  { value: "pdf", label: "PDF" },
  { value: "drive", label: "Drive Link" },
  { value: "notes", label: "Notes" },
  { value: "article", label: "Article" },
  { value: "internal", label: "Internal" },
];

interface CreateTaskFormProps {
  open: boolean;
  departmentId: string;
  moduleId: string;
  onClose: () => void;
  onCreated: () => void;
  editTask?: KBTask | null; // When provided, the form is in edit mode
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  open,
  departmentId,
  moduleId,
  onClose,
  onCreated,
  editTask,
}) => {
  const isEditing = !!editTask;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [difficulty, setDifficulty] = useState("beginner");
  const [expectedDays, setExpectedDays] = useState(1);
  const [tagsInput, setTagsInput] = useState("");
  const [attachmentsInput, setAttachmentsInput] = useState("");
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Resource input state
  const [resType, setResType] = useState<ResourceType>("youtube");
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");

  // Pre-fill form when editTask changes
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setPriority(editTask.priority || "medium");
      setDifficulty(editTask.difficulty || "beginner");
      setExpectedDays(editTask.expectedDays || 1);
      setTagsInput(editTask.tags?.join(", ") || "");
      setAttachmentsInput(editTask.attachments?.join("\n") || "");
      setResources(editTask.resources || []);
    } else {
      // Reset for create mode
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDifficulty("beginner");
      setExpectedDays(1);
      setTagsInput("");
      setAttachmentsInput("");
      setResources([]);
    }
    setError("");
  }, [editTask, open]);

  if (!open) return null;

  const addResource = () => {
    if (!resTitle.trim() || !resUrl.trim()) return;
    setResources((prev) => [
      ...prev,
      { type: resType, title: resTitle.trim(), url: resUrl.trim() },
    ]);
    setResTitle("");
    setResUrl("");
  };

  const removeResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setSubmitting(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const attachments = attachmentsInput
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      if (isEditing) {
        // ── UPDATE existing task ──────────────────────────────────────
        const res = await fetch("/api/kb-tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId: editTask!._id,
            title,
            description,
            priority,
            difficulty,
            expectedDays,
            tags,
            attachments,
            resources,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update task");
        }
      } else {
        // ── CREATE new task ───────────────────────────────────────────
        const res = await fetch("/api/kb-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleId,
            departmentId,
            title,
            description,
            priority,
            difficulty,
            expectedDays,
            tags,
            attachments,
            resources,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create task");
        }
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900 px-6 py-4 shrink-0">
          <h2 className="text-sm font-bold text-white tracking-tight">
            {isEditing ? "Edit Task" : "Create Task"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{ scrollbarWidth: "none" }}
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build a REST API with Express"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of the task…"
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 resize-none"
            />
          </div>

          {/* Priority + Difficulty + Days row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Expected Days
              </label>
              <input
                type="number"
                min={1}
                value={expectedDays}
                onChange={(e) => setExpectedDays(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. react, api, frontend"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Attachments / Links (one per line)
            </label>
            <textarea
              value={attachmentsInput}
              onChange={(e) => setAttachmentsInput(e.target.value)}
              placeholder={"https://example.com/doc.pdf\nhttps://drive.google.com/..."}
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 resize-none font-mono text-xs"
            />
          </div>

          {/* Learning Resources */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Learning Resources
            </label>

            {/* Existing resources */}
            {resources.length > 0 && (
              <div className="space-y-2 mb-3">
                {resources.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2"
                  >
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-20 shrink-0">
                      {r.type}
                    </span>
                    <span className="text-sm text-gray-800 flex-1 truncate">
                      {r.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeResource(i)}
                      className="shrink-0 text-gray-300 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add resource row */}
            <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-gray-200 p-3 bg-gray-50/50">
              <div className="w-28">
                <label className="text-[10px] text-gray-400 font-medium">Type</label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as ResourceType)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none"
                >
                  {RESOURCE_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-[10px] text-gray-400 font-medium">Title</label>
                <input
                  type="text"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="Resource title"
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-[10px] text-gray-400 font-medium">URL</label>
                <input
                  type="text"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none font-mono"
                />
              </div>
              <button
                type="button"
                onClick={addResource}
                className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? isEditing
                ? "Saving Changes…"
                : "Creating Task…"
              : isEditing
              ? "Save Changes"
              : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
