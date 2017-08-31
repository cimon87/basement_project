import { ICommandExecutor } from "./ICommandExecutor";
import { GammuDatabase } from "../Gammu/GammuDatabase";
import { Logger } from "../Logger/Logger";
import * as Gpio from 'raspi-gpio';
import { CommandEnum } from "../Enums/CommandEnum";
import { Command } from "../Models/Command";
import { Pins } from "../Statics/Pins";

export class GenericOnOffExecutor implements ICommandExecutor
{
    private LED_GPIO : number = 18;

    command: Command;
    Logger: Logger;
    SmsDatabase: GammuDatabase;
    LedGpio : Gpio.DigitalOutput;
    out : Gpio.DigitalInput;

    constructor(command : Command)
    {
        this.command = command;
        this.LedGpio = new Gpio.DigitalOutput(Pins.LED);
    }

    Execute() {
        if(this.command.Command == CommandEnum.ON)
        {
            this.LedGpio.write(1);

            if(this.command.Time > 0)
            {
                setTimeout(() => {
                    this.LedGpio.write(0);
                } , 1000 *  this.command.Time);  
            }
        }
        else if(this.command.Command == CommandEnum.OFF)
        {
            this.LedGpio.write(0);
        }
    }
}