"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const winston = require("winston");
const path = require("path");
class Logger {
    constructor(logName) {
        if (!fs.existsSync(Logger.logFolder)) {
            fs.mkdirSync(Logger.logFolder);
        }
        this._logger = new winston.Logger({
            transports: [
                new (winston.transports.File)({ filename: path.join(Logger.logFolder, '/' + logName) }),
                new (winston.transports.Console)()
            ]
        });
    }
    log(text) {
        this._logger.log('info', text);
    }
    error(text) {
        this._logger.log('error', text);
    }
}
Logger.logFolder = "logs";
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map