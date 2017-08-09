export interface IListener
{
    constructor(pin : string, listener : (state : boolean) => void);
}