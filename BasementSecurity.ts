import { GammuDatabase } from './Gammu/GammuDatabase';
import { CommandEnum } from './Enums/CommandEnum';
import { CommandParser } from './Helpers/CommandParser';
import { Logger } from './Logger/Logger';

export class BasementSecurity
{
    private gammu : GammuDatabase;

    public Run() : void
    {
        this.gammu = new GammuDatabase(this.NewMessageHandler)
        this.gammu.Connect();
    }

    public NewMessageHandler(newRow : any) : void
    {

    }

    public SIGINT() : void
    {
        process.on('SIGINT', () => {
            this.gammu.Disconnect();
        })
    }
}