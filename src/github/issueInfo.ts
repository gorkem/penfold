import * as Github from '@octokit/rest';
import * as gh from 'github-url-to-object';
import { IMessageConsumer} from '../protocol';

export class IssueInfoService implements IMessageConsumer {

  public receive(response: Hubot.Response<any>): void {

    const urls = response.message.text.match(/https:\/\/github\.com\/.+?\/issues\/\d*/g);
    urls.filter((item, pos)=> urls.indexOf(item) === pos).forEach(( url => {
      const ghUrl = gh(url);
      // tslint:disable-next-line:radix
      const issueNumber = parseInt(/(?:\/issues\/)(\d+)/g.exec(url)[1]);
      const options: Github.Options = Object.create(null);
      const github = new Github(options);
      const issueOpts: Github.IssuesGetParams = Object.create(null);
      issueOpts.owner = ghUrl.user;
      issueOpts.repo = ghUrl.repo;
      issueOpts.number = issueNumber;
      github.issues.get(issueOpts)
        .then(res => {
          if (res.data) {
            const issue = res.data;
            let infoMessage = `:${issue.state}_book: [${ghUrl.repo}#${issue.number}](${issue.html_url})\n${issue.title}\n`;
            if (issue.labels && issue.labels.length > 0) {
              for ( const label of issue.labels) {
                infoMessage += '`' + label.name + '` ';
              }
            }
            infoMessage += '\n';
            response.send(infoMessage);
          }
        });
    }));
  }

}

