"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Credentials_1 = require("../Statics/Credentials");
const Logger_1 = require("../Logger/Logger");
const MySQL = require("mysql");
const MySQLEvents = require("mysql-events");
class GammuDatabase {
    constructor(inputListener) {
        this._inputListener = inputListener;
        this._logger = new Logger_1.Logger("mysql.log");
    }
    Connect() {
        this._connection = MySQL.createConnection(Credentials_1.Credentials.MySQLCredentials);
        this._connection.connect((error) => {
            if (error) {
                this._logger.error('error connecting: ' + error.stack);
                return;
            }
            console.log('connected as id ' + this._connection.threadId);
            this.AttachListener();
        });
    }
    Disconnect() {
        this._mysqlEvents.stop();
        this._connection.end();
    }
    SendMessage(to, text) {
        if (this._connection == null) {
            throw new Error('Not connected to database');
        }
        this._connection.query("INSERT INTO outbox (DestinationNumber, TextDecoded) VALUES ('" + to + "','" + text + "');", (error, results, fields) => {
            if (error) {
                this._logger.error(error.stack);
            }
        });
    }
    AttachListener() {
        this._mysqlEvents = MySQLEvents(Credentials_1.Credentials.MySQLEventsCredentials);
        this._mysqlEvents.add('gammu.inbox', (oldRow, newRow, event) => {
            this._logger.log('Message from: ' + newRow.fields.SenderNumber + " Text: " + newRow.fields.TextDecoded);
            if (this._inputListener != null) {
                this._inputListener(newRow);
            }
        });
    }
}
exports.GammuDatabase = GammuDatabase;
//# sourceMappingURL=GammuDatabase.js.map