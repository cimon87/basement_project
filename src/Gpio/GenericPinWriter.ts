import { DigitalOutput } from 'raspi-gpio';
import { List } from "linqts/dist/linq";
import { IPin } from "./IPin";

export class GenericPinWriter implements IPin
{
    public PinName : string;
    public get State() : number{
        return this._state;
    }

    public set State(value : number){
        this._state = value;
        this.pin.write(value);
    }

    private pin: DigitalOutput;
    private _state : number;

    constructor(pinString: string) {
        this.pin = new DigitalOutput(pinString);
    }
    
}