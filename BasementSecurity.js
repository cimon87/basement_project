"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GammuDatabase_1 = require("./Gammu/GammuDatabase");
const CommandParser_1 = require("./Helpers/CommandParser");
const Logger_1 = require("./Logger/Logger");
const PhoneVerificator_1 = require("./Verification/PhoneVerificator");
const Messages_1 = require("./Statics/Messages");
const CommandExecutorsFactory_1 = require("./Executors/CommandExecutorsFactory");
class BasementSecurity {
    Run() {
        this.logger = new Logger_1.Logger('generic.log');
        this.phoneVerificator = new PhoneVerificator_1.PhoneVerificator();
        this.gammu = new GammuDatabase_1.GammuDatabase((newRow) => { this.NewMessageHandler(newRow); });
        this.gammu.Connect();
    }
    NewMessageHandler(newRow) {
        let senderNumber = newRow.fields.SenderNumber;
        let textDecoded = newRow.fields.TextDecoded;
        let updatedInDb = newRow.fields.UpdatedInDB;
        //verify income number 
        let shouldContinue = this.VerifyNumber(senderNumber);
        if (!shouldContinue) {
            console.log('sth wrong with number');
            return;
        }
        //verify if older than now minus 2 minutes
        var date = new Date();
        date.setMinutes(date.getMinutes() - 2);
        shouldContinue = this.IsOlderThan(newRow, date);
        if (!shouldContinue) {
            console.log('sth wrong with dates');
            return;
        }
        this.ProcessMessage(senderNumber, textDecoded);
    }
    ProcessMessage(number, text) {
        try {
            let command = CommandParser_1.CommandParser.Parse(text);
            let executor = CommandExecutorsFactory_1.CommandExecutorsFactory.GetExecutor(command);
            executor.SmsDatabase = this.gammu;
            executor.Execute();
        }
        catch (Error) {
            this.logger.error(Error.message);
            this.gammu.SendMessage(number, Error.message);
        }
    }
    IsOlderThan(newRow, date) {
        let senderNumber = newRow.fields.SenderNumber;
        let textDecoded = newRow.fields.TextDecoded;
        let updatedInDb = newRow.fields.UpdatedInDB;
        let dateIsOk = false;
        if (newRow.fields.UpdatedInDB >= date) {
            dateIsOk = true;
        }
        else {
            this.logger.log(Messages_1.Messages.MessageOutdatedFrom + senderNumber
                + Messages_1.Messages.Text + textDecoded);
        }
        return dateIsOk;
    }
    VerifyNumber(number) {
        let result = this.phoneVerificator.IsOurPhone(number);
        if (!result.IsSuccess()) {
            this.logger.log(result.Message);
        }
        return result.IsSuccess();
    }
    SIGINT() {
        process.on('SIGINT', () => {
            this.gammu.Disconnect();
        });
    }
}
var sec = new BasementSecurity();
sec.Run();
//# sourceMappingURL=BasementSecurity.js.map