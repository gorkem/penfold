import { IMessageConsumer, Response} from '../protocol';
import * as gh from 'github-url-to-object';
import * as Github from '@octokit/rest';

export class IssueInfoService implements IMessageConsumer {

  receive(response: Response): void {

    let urls = response.message.text.match(/https:\/\/github\.com\/.+?\/issues\/\d*/g);
    urls.filter((item, pos)=>{ return urls.indexOf(item) === pos; }).forEach(( url => {
      let ghUrl = gh(url);
      let issueNumber = parseInt(/(?:\/issues\/)(\d+)/g.exec(url)[1]);
      let options: Github.Options = Object.create(null);
      let github = new Github(options);
      let issueOpts: Github.IssuesGetParams = Object.create(null);
      issueOpts.owner = ghUrl.user;
      issueOpts.repo = ghUrl.repo;
      issueOpts.number = issueNumber;
      github.issues.get(issueOpts)
        .then(res => {
          if (res.data) {
            let issue = res.data;
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

