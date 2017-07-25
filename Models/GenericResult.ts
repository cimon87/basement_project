export class GenericResult
{
    public IsSuccess() : boolean 
    { 
         return typeof this.Message!='undefined' && this.Message != null; 
    };

    public Message : string;
}