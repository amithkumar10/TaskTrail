export interface Task {
  _id?: string
  userId: string
  name: string
  status: "pending" | "completed"
  timeSpent?: number   
  createdAt?: Date
  updatedAt?: Date
}