const { expect } = require('chai');

const { isRealString } = require('../../app/helpers/validation');

describe('Validation Helper', () => {
  describe('#isRealString', () => {
    describe('when string has valid format', () => {
      it('returns `true`', () => {
        ['abc', '   abc   ', '123', 'undefined'].forEach((str) => {
          expect(isRealString(str)).to.be.true;
        });
      });
    });

    describe('when string is invalid', () => {
      it('returns `false`', () => {
        ['     ', 123, {}, undefined, null].forEach((str) => {
          expect(isRealString(str)).to.be.false;
        });
      });
    });
  });
});
