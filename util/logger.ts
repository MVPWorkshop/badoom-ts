import winston, { format } from 'winston';
const {combine} = format;

const logger = winston.createLogger({
  format: combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => {
      const {timestamp, level, message, ...args} = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, undefined, 2) : ''}`;
    }),
  ),
  transports: [
    new (winston.transports.Console)({level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'})
  ]
});

export default logger;

