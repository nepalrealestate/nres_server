const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, json } = format;

const logger = createLogger({
    level: "debug",
    format: combine(
        timestamp(),
        json()  // Use the JSON formatter
    ),
    transports:[ 
        new transports.File({ filename: 'Error/error.json', level: 'error' }),
        new transports.File({ filename: 'Error/info.json', level: 'info' }),
    ]
});

module.exports = logger;
