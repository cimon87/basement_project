import { BasementSecurity } from './BasementSecurity';

class BasementStartup
{
    public static basementSecurity : BasementSecurity;

    public static Main():void
    {
        this.basementSecurity = new BasementSecurity();
        this.basementSecurity.Run();
    }
}

BasementStartup.Main();