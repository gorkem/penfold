import * as mongoose from 'mongoose';
import {IReport} from './model';

interface IReportModel extends IReport, mongoose.Document { };
let reportSchema = new mongoose.Schema({
  user: String,
  text: String,
  created_at: Date,
  channel: String,

});
let Report = mongoose.model<IReportModel>("Report", reportSchema);
export = Report;
