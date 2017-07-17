class Command{

    Command : string;
    Time : number;

    constructor(command:string, time:number)
    {
        this.Command = command;
        this.Time = time;
    }
}

export class CommandParser{
    public static Parse(command:string) : Command
    {
        let temp : string[] = command.trim().split(' ');
        let time : number = -1;
        
        if(temp.length > 1)
        {
            time = parseInt(temp[1]);
        }

        return new Command(temp[0].toUpperCase(), time)
    }
}