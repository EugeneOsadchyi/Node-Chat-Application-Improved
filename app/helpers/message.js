const moment = require('moment');

const generateMessage = (from, text, file = null) => (
  {
    from,
    text,
    file,
    createdAt: moment().valueOf(),
  }
);

module.exports = {
  generateMessage,
};
