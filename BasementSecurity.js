"use strict";
exports.__esModule = true;
var GammuDatabase_1 = require("./Gammu/GammuDatabase");
var CommandParser_1 = require("./Helpers/CommandParser");
var Logger_1 = require("./Logger/Logger");
var PhoneVerificator_1 = require("./Verification/PhoneVerificator");
var Messages_1 = require("./Statics/Messages");
var BasementSecurity = (function () {
    function BasementSecurity() {
    }
    BasementSecurity.prototype.Run = function () {
        this.logger = new Logger_1.Logger('generic.log');
        this.phoneVerificator = new PhoneVerificator_1.PhoneVerificator();
        this.gammu = new GammuDatabase_1.GammuDatabase(this.NewMessageHandler);
        this.gammu.Connect();
    };
    BasementSecurity.prototype.NewMessageHandler = function (newRow) {
        var senderNumber = newRow.fields.SenderNumber;
        var textDecoded = newRow.fields.TextDecoded;
        var updatedInDb = newRow.fields.UpdatedInDB;
        //verify income number
        var shouldContinue = this.VerifyNumber(senderNumber);
        if (!shouldContinue) {
            return;
        }
        //verify if older than now minus 2 minutes
        var date = new Date();
        date.setMinutes(date.getMinutes() - 2);
        shouldContinue = this.IsOlderThan(newRow, date);
        if (!shouldContinue) {
            return;
        }
        this.ProcessMessage(senderNumber, textDecoded);
    };
    BasementSecurity.prototype.ProcessMessage = function (number, text) {
        try {
            var command = CommandParser_1.CommandParser.Parse(text);
        }
        catch (Error) {
            this.logger.error(Error.message);
            this.gammu.SendMessage(number, Error.message);
        }
    };
    BasementSecurity.prototype.IsOlderThan = function (newRow, date) {
        var senderNumber = newRow.fields.SenderNumber;
        var textDecoded = newRow.fields.TextDecoded;
        var updatedInDb = newRow.fields.UpdatedInDB;
        var dateIsOk = false;
        if (newRow.fields.UpdatedInDB >= date) {
            dateIsOk = true;
        }
        else {
            this.logger.log(Messages_1.Messages.MessageOutdatedFrom + senderNumber
                + Messages_1.Messages.Text + textDecoded);
        }
        return dateIsOk;
    };
    BasementSecurity.prototype.VerifyNumber = function (number) {
        var result = this.phoneVerificator.IsOurPhone(number);
        if (!result.IsSuccess()) {
            this.logger.log(result.Message);
        }
        return result.IsSuccess();
    };
    BasementSecurity.prototype.SIGINT = function () {
        var _this = this;
        process.on('SIGINT', function () {
            _this.gammu.Disconnect();
        });
    };
    return BasementSecurity;
}());
exports.BasementSecurity = BasementSecurity;
