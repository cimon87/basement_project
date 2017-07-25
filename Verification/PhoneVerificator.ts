import { Phones } from '../Statics/Phones';
import { Messages } from '../Statics/Messages';
import { GenericResult } from '../Models/GenericResult';

export class PhoneVerificator
{
    public IsOurPhone(number : string) : GenericResult
    {
        let genericResult = new GenericResult();
        let found = Phones.Admins.Any(x => x.Phone === number);

        if(!found)
        {
           genericResult.Message = Messages.UnknownNumberMessage + number;
        }

        return genericResult;
    }
}