import { GammuDatabase } from './Gammu/GammuDatabase';
import { CommandEnum } from './Enums/CommandEnum';
import { CommandParser } from './Helpers/CommandParser';
import { Logger } from './Logger/Logger';
import { PhoneVerificator } from './Verification/PhoneVerificator';
import { GenericResult } from "./Models/GenericResult";
import { Messages } from "./Statics/Messages";
import { CommandExecutorsFactory } from "./Executors/CommandExecutorsFactory";
import { ICommandExecutor } from "./Executors/ICommandExecutor";
import { Pins, GenericPinReader, GenericPinWriter } from "./Gpio/All";
import { DigitalOutput, PULL_DOWN, PULL_NONE, PULL_UP} from 'raspi-gpio';
import {AutoWired, Inject, Singleton} from "typescript-ioc";

@Singleton
@AutoWired
export class BasementSecurity
{
    
    public sirenPin: GenericPinWriter;
    public ledPin: GenericPinWriter;
    public gammu: GammuDatabase;
    public phoneVerificator : PhoneVerificator;
    public logger : Logger;
    public switchPinListener : GenericPinReader;

    private enabled : boolean = false;
    public get Enabled () : boolean{
        return this.enabled;
    }

    public set Enabled (value : boolean){
        this.enabled = value;
        this.ledPin.State = value ? 0 : 1;
    }

    public SilentMode : boolean = false;
    public SmsEnabled : boolean = false;

    public Run() : void
    {
        this.ledPin = new GenericPinWriter(Pins.LED);
        this.sirenPin = new GenericPinWriter(Pins.SIREN);

        this.logger = new Logger('log.log');
        this.phoneVerificator = new PhoneVerificator();

        this.switchPinListener = new GenericPinReader(Pins.CONTACTON, PULL_UP)
        this.switchPinListener.AttachListener((state) => { this.SwitchInputHandler(state)})
        this.switchPinListener.Listen();

        this.switchPinListener = new GenericPinReader(Pins.SECURITY_SWITCH, PULL_UP)
        this.Enabled = this.switchPinListener.State === 1;
        this.switchPinListener.AttachListener((state) => { this.SwitchSecurityOnOff(state)})
        this.switchPinListener.Listen();

        this.gammu = GammuDatabase.getInstance();
        this.gammu.AddListener((newRow) => { this.NewMessageHandler(newRow) });
        
        this.gammu.Connect();
    }

    public SwitchSecurityOnOff(state: number): any {
        this.Enabled = state == 1;
    }

    public SwitchInputHandler(state : number) : void
    {
        this.sirenPin.State = 0;
        if(this.Enabled && !this.SilentMode)
        {
            this.sirenPin.State = state;
        }

        if(this.Enabled && this.SmsEnabled)
        {
            this.gammu.SendMessage("+48603705226", "Someone is in the basement!!")
        }
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

    public Dispose() : void
    {
        this.gammu.Disconnect();
    }
}