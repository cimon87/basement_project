import { GammuDatabase } from './Gammu/GammuDatabase';
import { CommandEnum } from './Enums/CommandEnum';
import { CommandParser } from './Helpers/CommandParser';
import { Logger } from './Logger/Logger';
import { PhoneVerificator } from './Verification/PhoneVerificator';
import { GenericResult } from "./Models/GenericResult";
import { Messages } from "./Statics/Messages";
import { CommandExecutorsFactory } from "./Executors/CommandExecutorsFactory";
import { ICommandExecutor } from "./Executors/ICommandExecutor";
import { GenericPinListener } from "./Listeners/GenericPinListener";
import { Pins } from "./Statics/Pins";
import { DigitalOutput, PULL_DOWN, PULL_NONE, PULL_UP} from 'raspi-gpio';

class BasementSecurity
{
    private gammu: GammuDatabase;
    private phoneVerificator : PhoneVerificator;
    private logger : Logger;
    private switchPinListener : GenericPinListener;

    public Run() : void
    {
        this.logger = new Logger('generic.log');
        this.phoneVerificator = new PhoneVerificator();

        this.switchPinListener = new GenericPinListener(Pins.SECURITY_SWITCH, PULL_UP)
        this.switchPinListener.AttachListener((state) => { this.SwitchInputHandler(state)})
        this.switchPinListener.Listen();

        this.gammu = new GammuDatabase((newRow) => { this.NewMessageHandler(newRow) })
        this.gammu.Connect();
    }

    public SwitchInputHandler(state : number) : void{
        var gpio = new DigitalOutput(Pins.LED);
        gpio.write(state);
    }

    public NewMessageHandler(newRow : any) : void
    {
        let senderNumber: string = newRow.fields.SenderNumber;
        let textDecoded: string = newRow.fields.TextDecoded;
        let updatedInDb: string = newRow.fields.UpdatedInDB; 

        //verify income number 
        let shouldContinue : boolean = this.VerifyNumber(senderNumber);
        if(!shouldContinue)
        {
            console.log('sth wrong with number');
            return; 
        }

        //verify if older than now minus 2 minutes
        var date : Date= new Date();
        date.setMinutes(date.getMinutes() - 2);

        shouldContinue = this.IsOlderThan(newRow, date);
        if(!shouldContinue)
        {
            console.log('sth wrong with dates');
            return;
        }

        this.ProcessMessage(senderNumber, textDecoded);
    }

    public ProcessMessage(number: string, text: string): void {
        try
        {
            let command = CommandParser.Parse(text);
            let executor : ICommandExecutor  = CommandExecutorsFactory.GetExecutor(command);
            executor.SmsDatabase = this.gammu;
            executor.Execute();
        }
        catch(Error)
        {
            this.logger.error(Error.message);
            this.gammu.SendMessage(number, Error.message)
        }
    }

    public IsOlderThan(newRow : any, date : Date) : boolean
    {
        let senderNumber = <string>newRow.fields.SenderNumber;
        let textDecoded = <string>newRow.fields.TextDecoded;
        let updatedInDb = <Date>newRow.fields.UpdatedInDB;

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

    public VerifyNumber(number: string) : boolean 
    {
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

var sec = new BasementSecurity();
sec.Run();