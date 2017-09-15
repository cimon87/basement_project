import {AutoWired, Inject, Singleton} from "typescript-ioc";
import { IPin, GenericPinReader, GenericPinWriter } from "./All";
import { List } from "linqts/dist/linq";
import 'automapper-ts';
import { Pins } from "./Pins";

@Singleton
@AutoWired 
export class GpioRegistry
{
    public gpios: List<IPin> = new List<IPin>();

    constructor()
    {
    }

    public Register(pin: IPin) : void
    {
        this.gpios.Add(pin);
    }

    public All() : Array<any>
    {
        return this.gpios.Select(x => x.ToDTO()).ToArray();
    }

    public SetGpioState(pinName : string, value : number) : void
    {
        let pin : IPin = this.gpios.FirstOrDefault(x => x.PinName === pinName);
        if(pin == null)
        {
            throw new Error("Gpio not found")
        }

        if(pin instanceof GenericPinWriter)
        {
            pin.State = value;            
        }
        else
        {
            throw new Error("Gpio is not writable");
        }
    }
}