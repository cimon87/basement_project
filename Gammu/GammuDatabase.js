"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Credentials_1 = require("../Statics/Credentials");
var Logger_1 = require("../Logger/Logger");
var MySQL = require("mysql");
var MySQLEvents = require("mysql-events");
var GammuDatabase = (function () {
    function GammuDatabase(inputListener) {
        this._inputListener = inputListener;
        this._logger = new Logger_1.Logger("mysql.log");
    }
    GammuDatabase.prototype.Connect = function () {
        var _this = this;
        this._connection = MySQL.createConnection(Credentials_1.Credentials.MySQLCredentials);
        this._connection.connect(function (error) {
            if (error) {
                _this._logger.error('error connecting: ' + error.stack);
                return;
            }
            console.log('connected as id ' + _this._connection.threadId);
            _this.AttachListener();
        });
    };
    GammuDatabase.prototype.Disconnect = function () {
        this._mysqlEvents.stop();
        this._connection.end();
    };
    GammuDatabase.prototype.SendMessage = function (to, text) {
        var _this = this;
        if (this._connection == null) {
            throw new Error('Not connected to database');
        }
        this._connection.query("INSERT INTO outbox (DestinationNumber, TextDecoded) VALUES ('" + to + "','" + text + "');", function (error, results, fields) {
            if (error) {
                _this._logger.error(error.stack);
            }
        });
    };
    GammuDatabase.prototype.AttachListener = function () {
        var _this = this;
        this._mysqlEvents = MySQLEvents(Credentials_1.Credentials.MySQLEventsCredentials);
        this._mysqlEvents.add('gammu.inbox', function (oldRow, newRow, event) {
            _this._logger.log('Message from: ' + newRow.fields.SenderNumber + " Text: " + newRow.fields.TextDecoded);
            if (_this._inputListener != null) {
                _this._inputListener(newRow);
            }
        });
    };
    return GammuDatabase;
}());
exports.GammuDatabase = GammuDatabase;
