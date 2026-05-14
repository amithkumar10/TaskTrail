"use client";

import React from "react";
import { LearningResource } from "@/app/models/KnowledgeBase";
import {
  Youtube,
  FileText,
  BookOpen,
  HardDrive,
  StickyNote,
  Newspaper,
  Server,
  ExternalLink,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  youtube: <Youtube className="h-4 w-4 text-red-500" />,
  documentation: <BookOpen className="h-4 w-4 text-blue-500" />,
  pdf: <FileText className="h-4 w-4 text-orange-500" />,
  drive: <HardDrive className="h-4 w-4 text-green-500" />,
  notes: <StickyNote className="h-4 w-4 text-yellow-600" />,
  article: <Newspaper className="h-4 w-4 text-purple-500" />,
  internal: <Server className="h-4 w-4 text-gray-500" />,
};

interface ResourceItemProps {
  resource: LearningResource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {
  const icon = iconMap[resource.type] || (
    <ExternalLink className="h-4 w-4 text-gray-400" />
  );

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-gray-100 shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-gray-900">
          {resource.title}
        </p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
          {resource.type}
        </p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </a>
  );
};

export default ResourceItem;
