import { Command } from "../Models/Command";
import { GammuDatabase } from "../Gammu/GammuDatabase";
import { ICommandExecutor } from "./ICommandExecutor";
import { CommandEnum } from "../Enums/CommandEnum";
import { GenericOnOffExecutor } from "./GenericOnOffExecutor";

export class CommandExecutorsFactory
{
    public static GetExecutor(command : Command) : ICommandExecutor
    {
        let commandExecutor : ICommandExecutor;

        switch (command.Command)
        {
            case CommandEnum.OFF:
            case CommandEnum.ON:
                commandExecutor = new GenericOnOffExecutor(command);
        }

        return commandExecutor;
    }
}