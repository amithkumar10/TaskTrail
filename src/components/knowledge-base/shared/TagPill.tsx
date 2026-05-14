"use client";

import React from "react";

interface TagPillProps {
  tag: string;
}

const TagPill: React.FC<TagPillProps> = ({ tag }) => {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200">
      #{tag}
    </span>
  );
};

export default TagPill;
