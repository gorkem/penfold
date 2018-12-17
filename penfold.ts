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
import { Response, Robot } from 'hubot';
import * as mongoose from 'mongoose';
import * as Q from 'q';
import * as winston from 'winston';
import {IssueInfoService} from './src/github/issueInfo';
import {ReminderService} from './src/reminder/service';
import {StandupService} from './src/standup/service';

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


function Penfold(robot: Robot<any>) {
  StandupService.robot = robot;
  ReminderService.robot = robot;
  // Health-check
  robot.router.get('/health-check', (req,resp) => {
    resp.end('OK');
  })

	robot.hear(/^\!*standup/i, (res: Response<any>) => {
    standupService.receive(res);
	});

  robot.respond(/away|vacation/i,(res: Response<any>)=>{
    reminderService.receive(res);
  });

  robot.hear(/https:\/\/github\.com\/.+?\/issues\/\d*/i, (res: Response<any>) =>{
    issueInfoService.receive(res);
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

  return `mongodb://${mongoauth}${mongohost}:27017/${mongodb}`;
}

function initMongo(conn: string) {
  (mongoose as any).Promise = Q.Promise;
  mongoose.connect(conn, {
    bufferMaxEntries: 0,
    keepAlive: 120,
    poolSize: 10,
    reconnectInterval: 1000,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true }).then(()=>{
      winston.info('connected to db');
      const db = mongoose.connection;
      // tslint:disable-next-line:no-console
      db.on('error', console.error.bind(console, 'connection error:'));
    }).catch(err=>{
      winston.error( err );
    });
}
