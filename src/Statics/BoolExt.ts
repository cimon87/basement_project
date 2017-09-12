export class BoolExt
{
    public static ToNumber(value : boolean) : number
    {
        if(value == true)
        {
             return 1;
        }

        return 0;
    }

    public static ToBoolean(value : number) : boolean
    {
        return value == 1;
    }
}