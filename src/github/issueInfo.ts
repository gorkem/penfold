import { IMessageConsumer, Response} from '../protocol';
import * as gh from 'github-url-to-object';
import * as fetch from 'node-fetch';

export class IssueInfoService implements IMessageConsumer {

  receive(response: Response): void {

    let urls = response.message.text.match(/https:\/\/github\.com\/.+?\/issues\/\d*/g);
    urls.forEach(( url => {
      let ghUrl = gh(url);
      let issueApiUrl = url.substring(url.lastIndexOf('/issues/'));
      fetch(ghUrl.api_url + issueApiUrl)
        .then(res => {
          if (res.status === 200) {
            return res.json();
          }
          return null;
        })
        .then(issue => {
          if (issue) {
            let infoMessage = `:${issue.state}_book: [${ghUrl.repo}#${issue.number}](${issue.html_url})\n${issue.title}\n`;
            if (issue.labels && issue.labels.length > 0) {
              for (let i = 0; i < issue.labels.length; i++) {
                infoMessage += '`' + issue.labels[i].name + '` ';
              }
            }
            infoMessage += '\n';
            response.send(infoMessage);
          }
        });
    }));
  }

}

