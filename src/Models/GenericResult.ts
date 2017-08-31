export class GenericResult
{
    constructor()
    {
        this.Message = "";
    }

    public IsSuccess() : boolean 
    { 
         return this.Message === ""; 
    };

    public Message : string;
}