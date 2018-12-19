
// // tslint:disable-next-line:no-implicit-dependencies
// import { expect } from 'chai';
// // tslint:disable-next-line:no-implicit-dependencies
// import * as co from 'co';
// // tslint:disable-next-line:no-implicit-dependencies
// import * as Helper from 'hubot-test-helper';

// const helper = new Helper('../scripts/penfold.js');

// let room;

// describe('Standup service', () => {
//   beforeEach(() => {
//     room = helper.createRoom({ httpd: false });
//   });

//   afterEach(() => {
//     room.destroy();
//   });

//   context('Users asks for standup reports', () => {
//     beforeEach( function (){
//       return co(function* () {
//         yield room.user.say('testuser', 'standup');
//         yield new Promise(resolve =>
//           setTimeout(resolve, 3000)
//         );
//       }.bind(this));
//     });

//       it('should report "no reports"', () => {
//         expect(room.messages).to.eq(
//           [
//             ['testuser', 'standup'],
//             ['hubot', 'Nothing noteworthy was reported lately.']
//           ]);
//       });

//    });// context
//   });// describe

    // it('should save a report', () => {
    //   return room.user.say('testuser', '@hubot standup a report')
    //     .then(() => {
    //       room.user.say('testuser', '@hubot standup');
    //     }
    //     ).then(() => {
    //       expect(room.messages).to.eql([['testuser', '@hubot standup a report'],
    //       ['testuser', '@hubot standup']]);
    //       expect(room.privateMessages).to.eql({
    //         'testuser': [
    //           ['hubot', 'a report']
    //         ]
    //       });

    //     });

    // });

