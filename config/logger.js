const winston = require('winston');

const env = process.env.NODE_ENV || 'development';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: `logs/${env}.log` }),
  ],
});

if (env !== 'production') {
  logger.add(new winston.transports.Console());
}

module.exports = logger;

