export interface Attendance {
  _id?: string;
  date: Date;
  status: 'Full Day' | 'WFH' | 'Half Day' | 'Leave';
  userId: string;
}