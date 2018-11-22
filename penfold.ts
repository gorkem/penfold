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
import {IssueInfoService} from './src/github/issueInfo';
import {Response,Robot} from './src/protocol';
import * as mongoose from 'mongoose';
import * as winston from 'winston';
import * as Q from 'q';

declare module 'mongoose' { type Promise<T> = Q.Promise<T>; }

  winston.configure({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

const mongoConnectionString = getMongoConnectionString();
initMongo(mongoConnectionString);
const standupService = new StandupService();
const reminderService = new ReminderService(mongoConnectionString);
const issueInfoService = new IssueInfoService();

function Penfold(robot: any) {
  let aRobot = new Robot(robot);
  StandupService.robot=aRobot;
  ReminderService.robot = aRobot;
  robot.router.all('*', (req,resp)=>{
    resp.send('hello');
  });

	robot.hear(/^\!*standup/i, (res: any) => {
    standupService.receive(new Response(res));
	});

  robot.respond(/away|vacation/i,(res:any)=>{
    reminderService.receive(new Response(res));
  });

  robot.hear(/https:\/\/github\.com\/.+?\/issues\/\d*/i, (res: any) =>{
    issueInfoService.receive(new Response(res));
  });

}
export = Penfold;

function getMongoConnectionString(): string {
  const mongouser = process.env.MONGODB_USER;
  const mongopass = process.env.MONGODB_PASSWORD;
  const mongodb =  process.env.MONGODB_DATABASE;
  const mongohost = process.env.MONGODB_HOST || 'mongodb';

  let mongoauth='';
  if(mongouser){
    mongoauth =  `${mongouser}:${mongopass}@`;
  }

  return `mongodb://${mongoauth}${mongohost}/${mongodb}`;
}

function initMongo(mongoConnectionString: string) {
  (<any>mongoose).Promise = Q.Promise;
  mongoose.connect(mongoConnectionString, { 
    reconnectTries: Number.MAX_VALUE, 
    keepAlive: 120, 
    useMongoClient: true });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    winston.info('connected to db');
  });
}
