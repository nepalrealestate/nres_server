const { timeStamp } = require('console');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
require('dotenv').config()


const myformat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
  //  format: winston.format.json(),
      format :combine(timestamp(),myformat),
     //format : format.simple(),

    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
       
        //new transports.File({ filename: './utils/errorLogging/error.log', level: 'error' }),
       // new transports.File({ filename: './utils/errorLogging/combined.log' }),
      ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format:format.simple(),
  }));
}

module.exports ={logger} 