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
//   standup - Display latest reports from the team member
//   standup <standup report> - record daily standup
//
// Author:
//   Gorkem Ercan
//
import {StandupService} from './src/standup/service';
import {Response,Robot} from './src/protocol';

const standupService = new StandupService();

function Penfold(robot: any) {
  // robot.parseHelp();
  StandupService.robot=new Robot(robot);
	robot.hear(/\!*standup/i, (res: any) => {
    standupService.receive(new Response(res));
	});

}
export = Penfold;
