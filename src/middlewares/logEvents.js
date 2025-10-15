const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logDir = path.join(__dirname, '../../logs/uriel');

        // Ensure log directory exists (creates if missing)
        await fsPromises.mkdir(logDir, { recursive: true });

        // Append the log item to the specified file
        await fsPromises.appendFile(path.join(logDir, logName), logItem);
    } catch (err) {
        console.error('Logging error:', err);
    }

    // Log to console for debugging
    console.log(logItem);
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin || 'unknown origin'}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = { logger, logEvents };
