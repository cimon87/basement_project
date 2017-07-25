import { CommandEnum } from '../Enums/CommandEnum';
import { Command } from '../Models/Command';

export class CommandParser{
    public static Parse(command:string) : Command
    {
        let temp : string[] = command.trim().split(' ');
        let time : number = -1;
        
        if(temp.length > 1)
        {
            time = parseInt(temp[1]);
        }

        return new Command(CommandEnum[temp[0].toUpperCase()], time)
    }
}