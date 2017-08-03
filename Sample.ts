import { Command } from "./Models/Command";
import { GenericOnOffExecutor } from "./Executors/GenericOnOffExecutor";
import { CommandEnum } from "./Enums/CommandEnum";
import { DigitalOutput } from "raspi-gpio";

class Start
{
    public static dig : DigitalOutput;

    static Run()
    {
        //let command = new Command(CommandEnum.ON, 5)
        //let executor = new GenericOnOffExecutor(command);

        //executor.Execute();

        this.dig = new DigitalOutput('GPIO18');
        this.dig.write(1);

        
    }

    SIGINT() : void
    {
        process.on('SIGINT', () => {
            Start.dig.write(0);
        })
    }
}

Start.Run();