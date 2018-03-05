import { BasementSecurity } from "../BasementSecurity";
import { Inject } from "typescript-ioc";
import { BoolExt } from "../Statics/BoolExt";
import { GammuDatabase } from "../Gammu/GammuDatabase";

export class SecurityController
{
    @Inject
    public Security : BasementSecurity;

    @Inject
    public GammuDatabase : GammuDatabase;

    public Switch(req, res) : void
    {
        if(req.body.Enabled === null && req.body.SmsEnabled === null && req.body.SilentMode === null)
        {
            res.send("Error: body does not contain Enabled or SilentMode");
        }
        else
        {
            if(req.body.Enabled != null)
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

    public GetSecurityPhones(req, res) : void
    {
        var phones = this.GammuDatabase.GetSecurityPhones()
        .then((result) => {
            res.json(result);
        }).catch((error) =>{
            res.send(error);
        })
    }

    public CreateSecurityPhone(req, res): any {
        var phones = this.GammuDatabase.CreateSecurityPhone(req.body)
        .then((result) => {
            res.json(result);
        }).catch((error) =>{
            res.send(error);
        })
    }
    public UpdateSecurityPhones(req, res): any {
        var phones = this.GammuDatabase.UpdateSecurityPhone(req.body)
        .then((result) => {
            res.json(result);
        }).catch((error) =>{
            res.send(error);
        })
    }
}