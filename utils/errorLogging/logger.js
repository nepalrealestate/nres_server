
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;



const myFormat = printf(({ level, message, timestamp }) => {
  if (typeof message === 'object') {
    // If message is an object, stringify it
    return `${timestamp} ${level}: ${JSON.stringify(message)}`;
  }
  // If message is a string, use it as is
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    level:"debug",
    format: combine(
      timestamp(),
      myFormat
    ),
    transports:[ 
        new transports.File({filename:'Error/error.log',level:'error'}),
        new transports.File({filename:'Error/info.log',level:'info'}),
    
     ]
    
})



module.exports = logger;