/** ── Knowledge Base + Task Assignment interfaces ────────────────────────── */

export interface Department {
  _id?: string;
  name: string;
  description?: string;
  color: string; // Hex colour for UI badges/cards
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Module {
  _id?: string;
  departmentId: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ResourceType =
  | "youtube"
  | "documentation"
  | "pdf"
  | "drive"
  | "notes"
  | "article"
  | "internal";

export interface LearningResource {
  type: ResourceType;
  title: string;
  url: string;
}

export type Priority = "low" | "medium" | "high" | "critical";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface KBTask {
  _id?: string;
  moduleId: string;
  departmentId: string; // Denormalised for faster queries
  title: string;
  description: string;
  priority: Priority;
  difficulty: Difficulty;
  expectedDays: number; // Expected completion timeline in days
  tags: string[];
  attachments: string[]; // External URLs
  resources: LearningResource[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskAssignment {
  _id?: string;
  kbTaskId: string;
  internId: string;
  departmentId: string;
  moduleId: string;
  assignedAt?: Date;
  deadline?: Date;
  emailSent: boolean;
}
