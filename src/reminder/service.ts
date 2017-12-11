import { IMessageConsumer, Response, Message} from '../protocol';
import * as business from 'moment-business';
import * as Agenda from 'agenda';
import * as moment from 'moment';
import * as logger from 'winston';
import * as Channel from '../standup/channel';
import * as Report from '../standup/report';


export class ReminderService implements IMessageConsumer {
  public static robot;

  private dbconn;
  constructor(dbConnectionString:string){
    this.dbconn = dbConnectionString;
    // this.initAgenda();
  }

  receive(response: Response): void {
    // let words = <string[]>response.message.body.split(/\s+/);
    // let user = response.findUser(response.message.userId).name;
    // if(words[0].charAt(0) === '@'){
    //   user = words[0].substring(1);
    // }
  }

  private initAgenda() {
    let agenda = new Agenda({ db: { address: this.dbconn } });
    agenda.name('standup-service');
    agenda.define('checkStandups', checkStandups);
    agenda.on('ready', () => {
      logger.info('agenda ready');
      agenda.every('30 * * * 1-5', 'checkStandups');
      agenda.start();
      logger.info('agendas scheduled');
    });
  }


}


// ##### Agenda processors #########
function checkStandups(job, done) {
  console.log('execute checkstandups');
  let now = moment();
  if (business.isWeekDay(now)) {
    let checkback = now.isoWeekday() === 1 ? 48 : 24;
    let querydate = now.subtract(checkback, 'hour');
    Channel.where('team').exists().then(channels => {
      for (let index = 0; index < channels.length; index++) {
        let channel = channels[index];
        channel.team.forEach(userId => {
          Report.findOne({ 'channel': channel.id, 'user': userId, 'created_at': { $gt: querydate.toDate() } })
            .then(result => {
              if (!result) {
                let user = ReminderService.robot.getUserForId(userId);
                if (user) {
                  ReminderService.robot.messageRoom(channel.id, `@${user.name} please remember to report your daily stand up`);
                } else {
                  logger.info('No user name found for ' + userId);
                }
              }
            });
        });
      }
    });
  }
  done();
}

