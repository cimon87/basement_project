import { BasementSecurity } from "../BasementSecurity";
import { Inject } from "typescript-ioc";
import { BoolExt } from "../Statics/BoolExt";

export class SecurityController
{
    @Inject
    public Security : BasementSecurity;

    public Switch(req, res) : void
    {
        if(req.body.IsEnabled == null && req.body.SmsEnabled == null && req.body.SmsEnabled)
        {
            res.send("Error: body does not contain IsEnabled or IsInSilentMode");
        }
        else
        {
            if(req.body.Enabled !== null)
            {
                this.Security.Enabled = BoolExt.ToBoolean(req.body.Enabled);
            }

            if(req.body.SilentMode != null)
            {
                this.Security.SilentMode = BoolExt.ToBoolean(req.body.SilentMode);
            }

            if(req.body.SmsEnabled != null)
            {
                this.Security.SmsEnabled = BoolExt.ToBoolean(req.body.SmsEnabled);
            }  

            return this.Status(req, res);
        }
    }

    public Status(req, res) : void
    {
        return res.json({ 
            Enabled : BoolExt.ToNumber(this.Security.Enabled),
            SilentMode : BoolExt.ToNumber(this.Security.SilentMode),
            SmsEnabled : BoolExt.ToNumber(this.Security.SmsEnabled)
         })
    }
}