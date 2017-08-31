import { CommandEnum } from '../Enums/CommandEnum';
import { Command } from '../Models/Command';
import { Messages } from '../Statics/Messages';

export class CommandParser{
    public static Parse(command:string) : Command
    {
        let temp : string[] = command.trim().split(' ');
        let time : number = -1;
        
        if(temp.length > 1)
        {
            time = parseInt(temp[1]);
        }

        let parsedCommand = CommandEnum[temp[0].toUpperCase()];
        if(parsedCommand == null)
        {
            throw new Error(Messages.UnknownCommand + command)
        }

        return new Command(parsedCommand, time)
    }
}