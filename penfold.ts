// Description:
//   Assistant for the daily activities for a coding team
//
// Dependencies:
//   None
//
// Configuration:
//   None
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

const mongoConnectionString = `mongodb://${mongouser}:${mongopass}@mongodb/${mongodb}`;

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
