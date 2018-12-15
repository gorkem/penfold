import * as mongoose from 'mongoose';
import {IChannel} from './model';

const channelSchema = new mongoose.Schema({
  id: String,
  meetingTime: Date,
  team: [String]
});
// tslint:disable-next-line:no-empty-interface
interface IChannelModel extends IChannel{}

const Channel = mongoose.model<IChannelModel>('Channel', channelSchema);
export = Channel;



