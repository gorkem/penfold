import * as mongoose from 'mongoose';
import {IChannel} from './model';

let channelSchema = new mongoose.Schema({
  id: String,
  team: [String],
  meetingTime: Date
});
interface IChannelModel extends IChannel{}

let Channel = mongoose.model<IChannelModel>('Channel', channelSchema);
export = Channel;



