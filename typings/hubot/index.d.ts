// Type definitions for hubot 2.19
// Project: https://github.com/github/hubot
// Definitions by: Dirk Gadsden <https://github.com/dirk>
//                 Kees C. Bakker <https://github.com/KeesCBakker>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as hubot from 'hubot'
import { Application } from 'express'

declare module 'hubot' {

  interface Message {
    user: User;
    text: string;
    id: string;
    room: string;
  }

  interface User {
    real_name: string
    email_address: string
  }

  interface Robot<A> {
    router : Application

    /** Public: A helper send function to message a room that the robot is in.
      *
      * @param room    - String designating the room to message.
      * @param strings - One or more Strings for each message to send.
      *
      * Returns nothing.
      */
    messageRoom(room: string, ...strings: string[]): void;
  }
}

