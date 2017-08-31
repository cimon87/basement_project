import { ILogger } from "./ILogger";
import * as fs from "fs";
import * as winston from 'winston';
import * as path from 'path';

export class Logger implements ILogger {
    public static logFolder : string = "logs";
    public _logger : winston.LoggerInstance;

    constructor(logName:string)
    {
        if ( !fs.existsSync( Logger.logFolder ) ) {
            fs.mkdirSync( Logger.logFolder );
        }

        this._logger = new winston.Logger({
            transports: [
                new (winston.transports.File)({ filename: path.join(Logger.logFolder, '/' + logName) }),
                new (winston.transports.Console)()
            ]
        });
    }
    
    public log(text:string) : void
    {
        this._logger.log('info', text);
    }

    public error(text:string) : void
    {
        this._logger.log('error', text);
    }
}