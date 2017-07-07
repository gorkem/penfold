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
const mongouser = process.env.MONGODB_USER;
const mongopass = process.env.MONGODB_PASSWORD;
const mongodb =  process.env.MONGODB_DATABASE;
const mongohost = process.env.MONGODB_HOST || 'mongodb';

let mongoauth='';
if(mongouser){
  mongoauth =  `${mongouser}:${mongopass}@`;
}

const mongoConnectionString = `mongodb://${mongoauth}${mongohost}/${mongodb}`;
console.log(mongoConnectionString);

const standupService = new StandupService(mongoConnectionString);
const reminderService = new ReminderService(mongoConnectionString);

function Penfold(robot: any) {
  StandupService.robot=new Robot(robot);
  ReminderService.robot = new Robot(robot);

	robot.hear(/\!*standup/i, (res: any) => {
    standupService.receive(new Response(res));
	});

  robot.respond(/away|vacation/i,(res:any)=>{
    reminderService.receive(new Response(res));
  });

}
export = Penfold;
