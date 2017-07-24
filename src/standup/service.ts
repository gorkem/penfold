import { IMessageConsumer, Response, Message, Robot} from '../protocol';
import * as Report from './report';
import * as Channel from './channel';
import * as moment from 'moment';
import * as logger from 'winston';
import { IChannel, IReport } from './model';


export class StandupService implements IMessageConsumer {
  public static robot:Robot;

  constructor() {
    //empty
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
         return Promise.resolve(channel);
        }
        let queryUser = StandupService.robot.getUserForId(response.message.userId);
        logger.debug('Sending report to user ',queryUser);
        response.send('Nothing noteworthy was reported lately.');
        return Promise.reject('No channel');
      }
    ).then(channel => {
      let mu = moment().utc();
      let hour = mu.startOf('hour');
      let searchStart = hour.subtract(24, 'hour');
      Report.find({ "channel": channel.id, "created_at": { $gt: searchStart.toDate() } }).sort({ created_at: -1 }).then(
        reports => {
          let reportMesage: string = 'Nothing noteworthy was reported lately.';
          if (reports && reports[0]) {
            reportMesage = '';
            logger.debug(reports.length + ' reports found for channel ' + channel.id);
            let reportedUser = [];
            reports.forEach(report => {
              if (reportedUser.indexOf(report.user)<0) {
                reportedUser.push(report.user);
                let user = StandupService.robot.getUserForId(report.user);
                let userName = user.name;
                if (user.realName && user.realName.length > 0) {
                  userName = user.realName;
                }
                let body = report.text;
                let time = moment().utc().to(moment(report.created_at));
                reportMesage += `:memo: _${userName} reported ${time}_\n${body}\n***\n`;
              }
            });
          }
          let queryUser = StandupService.robot.getUserForId(response.message.userId);
          logger.debug('Sending report to user ', queryUser);
          response.send(reportMesage);
          return Promise.reject('No reports');
        }
      );
    }).
    catch(error => {
      logger.warn(error);
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
