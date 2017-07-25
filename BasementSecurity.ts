import { GammuDatabase } from './Gammu/GammuDatabase';
import { CommandEnum } from './Enums/CommandEnum';
import { CommandParser } from './Helpers/CommandParser';
import { Logger } from './Logger/Logger';
import { PhoneVerificator } from './Verification/PhoneVerificator';
import { GenericResult } from "./Models/GenericResult";
import { Messages } from "./Statics/Messages";

export class BasementSecurity
{
    private gammu: GammuDatabase;
    private phoneVerificator : PhoneVerificator;
    private logger : Logger;

    public Run() : void
    {
        this.logger = new Logger('generic.log');
        this.phoneVerificator = new PhoneVerificator();

        this.gammu = new GammuDatabase(this.NewMessageHandler)
        this.gammu.Connect();
    }

    NewMessageHandler(newRow : any) : void
    {
        let senderNumber = newRow.fields.SenderNumber;
        let textDecoded = newRow.fields.TextDecoded;
        let updatedInDb = newRow.fields.UpdatedInDB;

        //verify income number
        let shouldContinue = this.VerifyNumber(senderNumber);
        if(!shouldContinue)
        {
            return;
        }

        //verify if older than now minus 2 minutes
        var date = new Date();
        date.setMinutes(date.getMinutes() - 2);

        shouldContinue = this.IsOlderThan(newRow, date);
        if(!shouldContinue)
        {
            return;
        }

        this.ProcessMessage(senderNumber, textDecoded);
    }

    ProcessMessage(number: string, text: string): void {
        try
        {
            let command = CommandParser.Parse(text);
        }
        catch(Error)
        {
            this.logger.error(Error.message);
            this.gammu.SendMessage(number, Error.message)
        }
    }

    IsOlderThan(newRow : any, date : Date) : boolean
    {
        let senderNumber = newRow.fields.SenderNumber;
        let textDecoded = newRow.fields.TextDecoded;
        let updatedInDb = newRow.fields.UpdatedInDB;

        let dateIsOk = false;
        if(newRow.fields.UpdatedInDB >= date)
        {
            dateIsOk = true;
        }
        else
        {
            this.logger.log(Messages.MessageOutdatedFrom + senderNumber 
                + Messages.Text + textDecoded);
        }

        return dateIsOk;
    }

    VerifyNumber(number: string): boolean {
        let result : GenericResult = this.phoneVerificator.IsOurPhone(number);
        if(!result.IsSuccess())
        {
            this.logger.log(result.Message)
        }

        return result.IsSuccess();
    }

    SIGINT() : void
    {
        process.on('SIGINT', () => {
            this.gammu.Disconnect();
        })
    }
}