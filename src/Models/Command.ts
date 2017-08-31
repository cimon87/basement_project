import { CommandEnum } from '../Enums/CommandEnum';

export class Command
{
    Command : CommandEnum;
    Time : number;

    constructor(command:CommandEnum, time:number)
    {
        this.Command = command;
        this.Time = time;
    }
}