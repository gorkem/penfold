
export class Response {
  private kernel: any;
  constructor(res) {
    this.kernel = res;
  }

  /**
   * Sends the given message as response.
   */
  public send(msg: string) {
    if (msg) {
      this.kernel.send(msg);
    }
  }

  get message(): Message {
    return new Message(this.kernel);
  }

  public findUser(id: string): User {
    return new User(this.kernel.message.user);
  }
}

export class Robot {
  private kernel: any;
  constructor(rob) {
    this.kernel = rob;
  }

  public messageRoom(room: string, msg: string): void {
    if (room && msg) {
      this.kernel.messageRoom(room, msg);
    }
  }

  public getUserForId(id: string): User {
    let u = this.kernel.brain.userForId(id);
    if (u) {
      return new User(u);
    }
    return null;
  }
}

export class User {
  private kernel;
  constructor(usr) {
    this.kernel = usr;
  }
  get id() {
    return this.kernel.id;
  }
  get name() {
    return this.kernel.name;
  }
  get realName() {
    return this.kernel.real_name;
  }

}


export class Message {
  private kernel: any;

  constructor(res) {
    this.kernel = res;
  }
  get body() {
    let matches: string[] = this.kernel.match;
    if (!matches.length) {
      return "";
    }
    return this.kernel.message.text.split(matches[0])[1];
  }

  get text() :string{
    return this.kernel.message.text;
  }

  get room() {
    return this.kernel.message.room;
  }

  get userId() {
    return this.kernel.message.user.id;
  }
}

/**
 * Interface for services that consume messages
 */
export interface IMessageConsumer {
  receive(response: Response): void;
}
