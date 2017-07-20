// Description:
//   Assistant for the daily activities for a coding team
//
// Dependencies:
//   None
//
// Configuration:
//   MONGODB_USER - The user used for mongo db based persistence
//   MONGODB_PASSWORD - Password for the MONGODB_USER
//   MONGODB_DATABASE - the name of the mongo db
//   MONGODB_HOST - the host for mongo db
//
// commands:
//   standup - Display latest reports from the team members
//   standup <standup report> - record daily standup
//
// Author:
//   Gorkem Ercan
//
import {StandupService} from './src/standup/service';
import {ReminderService} from './src/reminder/service';
import {Response,Robot} from './src/protocol';
import * as mongoose from 'mongoose';
import * as winston from 'winston';
let logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

const mongouser = process.env.MONGODB_USER;
const mongopass = process.env.MONGODB_PASSWORD;
const mongodb =  process.env.MONGODB_DATABASE;
const mongohost = process.env.MONGODB_HOST || 'mongodb';

let mongoauth='';
if(mongouser){
  mongoauth =  `${mongouser}:${mongopass}@`;
}

const mongoConnectionString = `mongodb://${mongoauth}${mongohost}/${mongodb}`;
mongoose.connect(mongoConnectionString, { server: { reconnectTries: Number.MAX_VALUE, keepAlive: 120  } });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  logger.info('connected to db');
});
const standupService = new StandupService();
const reminderService = new ReminderService(mongoConnectionString);


function Penfold(robot: any) {
  StandupService.robot=new Robot(robot);
  ReminderService.robot = new Robot(robot);

  robot.router.all('*', (req,resp)=>{
    resp.send('hello');
  });

	robot.hear(/\!*standup/i, (res: any) => {
    standupService.receive(new Response(res));
	});

  robot.respond(/away|vacation/i,(res:any)=>{
    reminderService.receive(new Response(res));
  });

}
export = Penfold;
