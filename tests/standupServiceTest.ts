
import * as Helper from 'hubot-test-helper';
import { expect } from 'chai';

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
      expect(room.messages).to.eql([['testuser', '@hubot standup'],
      ['hubot', 'No standup reports on room1']]);
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
