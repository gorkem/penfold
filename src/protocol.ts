
/**
 * Interface for services that consume messages
 */
export interface IMessageConsumer {
  receive(response: Hubot.Response<any>): void;
}

// public getDisplayName(): string {
//   if (this.realName && this.realName.trim().length > 0) {
//     return this.realName;
//   } else {
//     return this.name;
//   }
// }
/**
 * Utilities for processing messages.
 */
export class MessageUtilities {

  public static getMessageBody(response : Hubot.Response<any>) : string {
    const matches: string[] = response.match;
    if (!matches.length) {
      return '';
    }
    return response.message.text.split(matches[0])[1];
  }

}
