import { Response } from "hubot";

/**
 * Interface for services that consume messages
 */
export interface IMessageConsumer {
  receive(response: Response<any>): void;
}



