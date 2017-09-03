import { BasementSecurity } from "../BasementSecurity";

export class GpioController
{
    private basementSecurity : BasementSecurity;

    constructor(BasementSecurity)
    {
        this.basementSecurity = BasementSecurity;
    }

    public GetAll(request, response)
    {
        
    }
}