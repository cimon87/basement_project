import { init } from 'raspi';

export interface IListener
{
    constructor(pinString : string, pullUpNumber: number);
    AttachListener(listener : (state : number) => void);
    Listen();
}