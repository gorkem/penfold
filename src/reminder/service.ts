import * as Agenda from 'agenda';
import { Response, Robot } from 'hubot';
import * as moment from 'moment';
import * as business from 'moment-business';
import * as logger from 'winston';
import { IMessageConsumer} from '../protocol';
import * as Channel from '../standup/channel';
import { IChannel } from '../standup/model';
import * as Report from '../standup/report';


export class ReminderService implements IMessageConsumer {
  public static robot:Robot<any>;

  private dbconn:string;

  constructor(dbConnectionString:string){
    this.dbconn = dbConnectionString;
    this.initAgenda();
  }

  public receive(response: Response<any>): void {
    // ReminderService.robot.send(envelope, envelope)
    // let words = <string[]>response.message.body.split(/\s+/);
    // let user = response.findUser(response.message.userId).name;
    // if(words[0].charAt(0) === '@'){
    //   user = words[0].substring(1);
    // }
  }

  private initAgenda() {
    const agenda = new Agenda({ db: { address: this.dbconn } });
    agenda.name('standup-service');
    agenda.define('checkStandups', checkStandups);
    agenda.on('ready', () => {
      logger.info('agenda ready');
      // every 6h on weekdays
      agenda.every('0 */6 * * 1-5', 'checkStandups');
      agenda.start();
      logger.info('agendas scheduled');
    });
  }
}

// ##### Agenda processors #########
function checkStandups(job, done) {
  logger.debug('execute checkstandups');
  const now = moment();
  if (business.isWeekDay(now)) {
    const checkback = now.isoWeekday() === 1 ? 48 : 24;
    const querydate = now.subtract(checkback, 'hour');
    Channel.where('team').exists().then(channels => {
      for (const channel of channels) {
        channel.team.forEach(userId => {
          remindUser(channel, userId, querydate);
          }
        );
      }
      Promise.resolve(channels);
    });
  }
  done();

  function remindUser(channel: IChannel, userId: any, querydate: moment.Moment) {
    Report.findOne({ 'channel': channel.id, 'user': userId, 'created_at': { $gt: querydate.toDate() } })
      .then(result => {
        if (!result) {
          const user = ReminderService.robot.brain.userForId(userId);
          if (user) {
            ReminderService.robot.messageRoom(channel.id, `@${user.name} please remember to report your daily stand up`);
          }
          else {
            logger.info('No user name found for ' + userId);
          }
        }
        Promise.resolve(result);
      });
  }
}

