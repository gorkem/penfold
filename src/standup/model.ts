
export interface IChannel{
  id:string;
  team:string[];
  meetingTime:Date;
}
export interface IReport {
  user: string;
  text: string;
  created_at: Date;
  channel: string;
}
