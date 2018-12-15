
// tslint:disable-next-line:no-implicit-dependencies
import { expect } from 'chai';
// tslint:disable-next-line:no-implicit-dependencies
import * as Helper from 'hubot-test-helper';

const helper = new Helper('../penfold.js');
let room;

beforeEach(() => {
  room = helper.createRoom({ httpd: false });
});
afterEach(() => {
  room.destroy();
});

describe('Standup service', () => {
  it('should report "no reports"', () => {
    return room.user.say('testuser', '@hubot standup').then(() => {
      expect(room.messages).to.eq([['testuser', '@hubot standup'],
      ['hubot', 'Nothing noteworthy was reported lately.']]);
    }
    );
  });

  it('should save a report', () => {
    return room.user.say('testuser', '@hubot standup a report')
    .then(()=>{
      room.user.say('testuser', '@hubot standup');
     }
    ).then(()=>{
      expect(room.messages).to.eql([['testuser', '@hubot standup a report'],
      ['testuser', '@hubot standup']]);
      expect(room.privateMessages).to.eql({
        'testuser': [
          ['hubot', 'a report']
        ]
      });

  });

});

});
