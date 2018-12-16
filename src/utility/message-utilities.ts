import { Response } from "hubot";

/**
 * Utilities for processing messages.
 */
export class MessageUtilities {

  public static getMessageBody(response : Response<any>) : string {
    const matches: string[] = response.match;
    if (!matches.length) {
      return '';
    }
    return response.message.text.split(matches[0])[1];
  }

}
