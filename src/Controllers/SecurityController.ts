import { BasementSecurity } from "../BasementSecurity";
import { Inject } from "typescript-ioc";

export class SecurityController
{
    @Inject
    public Security : BasementSecurity;

    public Switch(req, res) : void
    {
        if(req.body.IsEnabled === null && req.body.IsInSilentMode === null)
        {
            res.send("Error: body does not contain IsEnabled or IsInSilentMode");
        }
        else
        {
            if(req.body.Enabled !== null)
            {
                this.Security.Enabled = req.body.Enabled;
            }

            if(req.body.IsInSilentMode !== null)
            {
                this.Security.SilentMode = req.body.SilentMode;
            }

            if(req.body.SmsEnabled !== null)
            {
                this.Security.SmsEnabled = req.body.SmsEnabled;
            }  
        }
    }

    public Status(req, res) : void
    {
        return res.json({ 
            Enabled : this.Security.Enabled,
            SilentMode : this.Security.SilentMode,
            SmsEnabled : this.Security.SmsEnabled
         })
    }
}