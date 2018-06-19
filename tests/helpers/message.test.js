const { expect } = require('chai');
const sinon = require('sinon');

const moment = require('moment');

const { generateMessage } = require('../../app/helpers/message');

describe('Message Helper', () => {
  describe('#generateMessage', () => {
    let from;
    let text;
    let file;
    let createdAt;

    beforeEach(() => {
      from = 'User';
      text = 'Message body';
      file = {
        name: 'file',
        path: '/path/to/file',
      };

      createdAt = moment().valueOf();
      sinon.useFakeTimers(createdAt);
    });

    it('should contain `from`, `text`, `file` and `createdAt` properties', () => {
      const expectedMessage = {
        from,
        text,
        file,
        createdAt,
      };

      expect(generateMessage(from, text, file)).to.deep.include(expectedMessage);
    });

    describe('when `file` attribute is not passed', () => {
      it('should set `file` property to be null', () => {
        expect(generateMessage(from, text)).to.deep.include({ file: null });
      });
    });
  });
})
