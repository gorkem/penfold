import * as mongoose from 'mongoose';

export interface IChannel extends mongoose.Document{
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
