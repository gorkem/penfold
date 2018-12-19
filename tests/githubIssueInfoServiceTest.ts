
// tslint:disable-next-line:no-implicit-dependencies
import { expect } from 'chai';
// tslint:disable-next-line:no-implicit-dependencies
import * as co from 'co';
// tslint:disable-next-line:no-implicit-dependencies
import * as Helper from 'hubot-test-helper';

const helper = new Helper('../scripts/penfold.js');
const TEST_URL= `https://github.com/gorkem/penfold/issues/16`
const TEST_URL2= `https://github.com/gorkem/penfold/issues/2`
const RESPONSE_STRING = ':open_book: [penfold#16](https://github.com/gorkem/penfold/issues/16)\nshould print details of a jira issue\n\n'
const RESPONSE_STRING2 = ':closed_book: [penfold#2](https://github.com/gorkem/penfold/issues/2)\n\"standup\" is not unique enough as keyword\n\n'

let room;

describe('Github service', () => {
  beforeEach(() => {
    room = helper.createRoom({ httpd: false });
  });

  afterEach(() => {
    room.destroy();
  });

  context('Users mentions an issue in the room in the middle of a sentence', () => {
    beforeEach( function (){
      return co(function* () {
        yield room.user.say('testuser', `This is a ${TEST_URL} that is`);
        yield new Promise(resolve =>
          setTimeout(resolve, 1000)
        );
      }.bind(this));
    });
      it('should give info if it is at the middle of a sentence', () => {
        expect(room.messages).to.eql(
          [
            ['testuser', `This is a ${TEST_URL} that is` ],
            ['hubot', RESPONSE_STRING]
          ]);
      });

   });// context

   context('User pastes an issue URL', () => {
    beforeEach( function (){
      return co(function* () {
        yield room.user.say('testuser', TEST_URL);
        yield new Promise(resolve =>
          setTimeout(resolve, 1000)
        );
      }.bind(this));
    });

      it('should give info if ony url is send', () => {
        expect(room.messages).to.eql(
          [
            ['testuser', TEST_URL],
            ['hubot', RESPONSE_STRING]
          ]);
      });
   });// context

   context('User pastes multiple issue URLs', () => {
    beforeEach( function (){
      return co(function* () {
        yield room.user.say('testuser', `${TEST_URL2} and ${TEST_URL}`  );
        yield new Promise(resolve =>
          setTimeout(resolve, 1000)
        );
      }.bind(this));
    });

      it('should give info if for both urls', () => {
        expect(room.messages).to.eql(
          [
            ['testuser', `${TEST_URL2} and ${TEST_URL}`],
            ['hubot', RESPONSE_STRING],
            ['hubot', RESPONSE_STRING2]
          ]);
      });
   });// context

  });// describe
