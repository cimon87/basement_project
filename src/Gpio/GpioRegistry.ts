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
        console.log("Registred " + pin.PinName);
        this.gpios.Add(pin);
    }

    public All()
    {
        return this.gpios.Select(x => x.ToDTO()).ToArray();
    }
}