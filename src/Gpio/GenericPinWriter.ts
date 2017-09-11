import { DigitalOutput } from 'raspi-gpio';
import { List } from "linqts/dist/linq";
import { IPin } from "./IPin";
import { GpioRegistry } from "./GpioRegistry";
import { Inject } from "typescript-ioc";
import { Pins } from './All';

export class GenericPinWriter implements IPin
{
    @Inject
    public Registry : GpioRegistry;

    public PinName : string;
    public get State() : number{
        return this._state;
    }

    public set State(value : number){
        this._state = value;
        this.pin.write(value);
    }

    private pin: DigitalOutput;
    private _state : number = 0;

    constructor(pinString: string) {
        this.pin = new DigitalOutput(pinString);
        this.PinName = pinString;
        this.Registry.Register(this);
    }

    public ToDTO()
    {
        return {
            State : this.State,
            PinName : this.PinName,
            Description : Pins.GetDescription(this.PinName)
        }
    }
    
}