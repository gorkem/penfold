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
    } else if (response.message.body.trim().length < 1) {
      this.printStandupReport(response);
    } else {//save a report
      this.updateChannel(response)
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
        if (!channel) {
          this.sendResponse('Nothing noteworthy was reported lately.', response);
          return Promise.reject('No channel');
        } else {
          logger.debug(`channel found for ${response.message.room} is ${channel}`);
          return Promise.resolve(channel);
        }
      }
    ).then(channel => {
      let searchStart = this.getSearchStart();
      Report.find({ 'channel': channel.id, 'created_at': { $gt: searchStart.toDate() } }).sort({ created_at: -1 }).then(
        reports => {
          if (!reports || reports.length === 0) {
            logger.debug(`No reports found for channel ${channel.id}`);
            this.sendResponse('Nothing noteworthy was reported lately.', response);
            return Promise.reject('No reports');
          } else {
            logger.debug(`${reports.length} reports found for channel ${channel.id}`);
            let reportMessage = this.getReportMessage(reports);
            this.sendResponse(reportMessage, response);
            return Promise.resolve(reports);
          }
        }
      );
    }).
    catch(error => {
      logger.warn(error);
    });
  }

  private getReportMessage(reports: IReport[]) {
    let reportMessage = '';
    let reportedUser = [];
    reports.forEach(report => {
      if (reportedUser.indexOf(report.user) < 0) {
        reportedUser.push(report.user);
        let user = StandupService.robot.getUserForId(report.user);
        let userName = user.getDisplayName();
        let body = report.text;
        let time = moment().utc().to(moment(report.created_at));
        reportMessage += `:memo: _${userName} reported ${time}_\n${body}\n***\n`;
      }
    });
    return reportMessage;
  }

  private getSearchStart(): moment.Moment {
    let mu = moment().utc();
    let hour = mu.startOf('hour');
    return hour.subtract(24, 'hour');
  }

  private sendResponse(message: string, response: Response) {
    let queryUser = StandupService.robot.getUserForId(response.message.userId);
    logger.debug(`Sending report ${message} to user ${queryUser}`);
    response.send(message);
  }

  private updateChannel(response: Response): Promise<IChannel> {
    return new Promise((resolve, reject) => {
      Channel.findOne({ id: response.message.room }, (error, channel) => {
        if (error) {
          return reject(error);
        }
        if (!channel) {
          logger.debug(`channel ${response.message.room} does not exist yet. Saving it.`);
          channel = new Channel();
          channel.id = response.message.room;
          channel.team.push(response.message.userId);
          channel.save();
        } else if (channel.team.indexOf(response.message.userId) === -1) { 
          logger.debug(`adding user ${response.message.userId} to channel ${response.message.room}`);
          channel.team.push(response.message.userId);
          channel.save();
        }
        return resolve(channel);
      });
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
