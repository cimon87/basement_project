"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var winston = require("winston");
var path = require("path");
var Logger = (function () {
    function Logger(logName) {
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
    Logger.prototype.log = function (text) {
        this._logger.log('info', text);
    };
    Logger.prototype.error = function (text) {
        this._logger.log('error', text);
    };
    Logger.logFolder = "logs";
    return Logger;
}());
exports.Logger = Logger;
