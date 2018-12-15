import * as mongoose from 'mongoose';
import {IReport} from './model';

interface IReportModel extends IReport, mongoose.Document { }
const reportSchema = new mongoose.Schema({
  channel: String,
  created_at: Date,
  text: String,
  user: String
});
const Report = mongoose.model<IReportModel>('Report', reportSchema);
export = Report;
