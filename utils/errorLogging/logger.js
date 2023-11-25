const winston = require("winston");
const fs = require('fs');

const filePath = 'Error/DB/dbinit.log';

// Check if the file exists before writing
if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, ''); // This will clear the contents of the file
}


const jsonFormat = winston.format.printf(({ level, message, timestamp }) => {
    return ({ timestamp, level, message });
});

const customLevels = {
    levels:{
    error: 0,
    warn: 1,
    info: 2,
    db: 3,
    debug: 4,
    dbinit:5
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        db: 'blue',
        debug: 'gray'
      }
}

winston.addColors(customLevels.colors)



const logger = winston.createLogger({

  

    levels:customLevels.levels,
    level:'debug',

    format:winston.format.combine(
   
        winston.format.timestamp(),
    
    
    ),
    
    transports:[
        new winston.transports.File({filename:'Error/error.log',level:'error'}),
        new winston.transports.File({filename:'Error/httpError.log',level:'http'}),
        new winston.transports.File({filename:'Error/info.log',level:'info'}),
        new winston.transports.File({filename:'Error/warn.log',level:'warn'}),
        new winston.transports.File({filename:'Error/DB/dbinit.log',level:'dbinit'}),
        new winston.transports.File({filename:'Error/combined.log',level:'debug'})
     ]
    
})



module.exports = logger;