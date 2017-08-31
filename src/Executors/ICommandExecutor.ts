import { GammuDatabase } from "../Gammu/GammuDatabase";

export interface ICommandExecutor
{
    SmsDatabase : GammuDatabase;
    Execute();
}