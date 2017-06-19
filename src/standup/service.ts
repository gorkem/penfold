import { IMessageConsumer, Response, Message, Robot} from '../protocol';
import * as Report from './report';
import * as Channel from './channel';
import * as moment from 'moment';
import * as winston from 'winston';
import * as mongoose from 'mongoose';
import { IChannel, IReport } from './model';

let logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

export class StandupService implements IMessageConsumer {
  public static robot:Robot;

  constructor(mongoConnectionString:string) {
    mongoose.connect(mongoConnectionString);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      logger.info('connected to db');
      // we're connected!
    });
  }

  receive(response: Response) {
    if (!response.message.room) {
      response.send('Get a room!!');
    }
    else if (response.message.body.trim().length < 1) {
      this.printStandupReport(response);
    } else {//save a report
      this.saveChannelIfNotExists(response)
        .then((channel) => {
          return Promise.all([this.saveStandupReport(response),
          this.addUserToChannelTeamIfNeeded(channel, response.message.userId)]);
        })
        .catch(error => {
          logger.error(error);
        });
    }
  }

  private printStandupReport(response: Response): void {
    logger.debug('Print report for ', response.message.room);
    Channel.findOne({ id: response.message.room }).then(
      channel => {
        logger.debug('channel found for '+response.message.room +' is '+channel);
        if (channel) {
          let mu = moment().utc();
          let hour = mu.startOf('hour');
          let searchStart = hour.subtract(24, 'hour');
          Report.find({ "channel": channel.id, "created_at": { $gt: searchStart.toDate() } }).then(
            reports => {
              let reportMesage: string = '';
              if (reports && reports[0]) {
                logger.debug(reports.length+' reports found for channel ' + channel.id );
                reports.forEach(report => {
                  let user = StandupService.robot.getUserForId(report.user);
                  let userName = user.realName || user.name;
                  let body = report.text;
                  let time = moment().utc().to(moment(report.created_at));
                  reportMesage += `#### ${userName} reported ${time}\n ${body}\n`;
                });
              }
              let queryUser = response.findUser(response.message.userId);
              logger.debug('Sending report to user ',queryUser);
              response.send(reportMesage);
            }
          );
        }
      }
    ).catch(error => {
      logger.error(error);
    });

  };

  private saveChannelIfNotExists(response: Response): Promise<IChannel> {
    return new Promise((resolve, reject) => {
      Channel.findOne({ id: response.message.room }, (error, channel) => {
        if (error) {
          reject(error);
          return;
        }
        if (!channel) {
          channel = new Channel();
          channel.id = response.message.room;
          channel.team.push(response.message.userId);
          return channel.save();
        }
        resolve(channel);
      }
      );

    });

  }

  private addUserToChannelTeamIfNeeded(channel: IChannel, userId: string): Promise<void> {
    if (channel.team.indexOf(userId) > -1) {
      return Promise.resolve();
    } else {
      channel.team.push(userId);
      return new Promise<void>((resolve, reject) => {
        Channel.update({ id: channel.id }, { $set: { team: channel.team } }, (err, raw) => {
          if (err) {
            reject(err);
          }
        });
      });
    }
  }

  private saveStandupReport(response: Response): Promise<IReport> {
    let channelID = response.message.room;
    let message: Message = response.message;
    let report = new Report();
    report.channel = channelID;
    report.text = message.body.trim();
    report.user = message.userId;
    report.created_at = moment().utc().toDate();
    logger.debug('saving report', report);
    return report.save();
  }
}
