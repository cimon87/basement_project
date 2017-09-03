import { DigitalInput } from 'raspi-gpio';
import { List } from "linqts/dist/linq";
import { IPin } from "./IPin";

export class GenericPinReader implements IPin
{
    public State : number;
    public PinName : string;

    private pin: DigitalInput;
    private listeners : List<(state: number) => void>;

    constructor(pinName: string, pullUpNumber: number) {

        this.PinName = pinName;
        this.State = 0;

        this.pin = new DigitalInput({
            pin : pinName,
            pullResistor : pullUpNumber
        })

        this.listeners = new List<(state: number) => void>();
    }

    public AttachListener(listener: (state: number) => void) {
        this.listeners.Add(listener);
    }

    public Listen() {
        this.pin.addListener('change', (state) => {

            this.State = state;

            this.listeners.ForEach((listener) => {
                listener(state);
            })
        })
    }
}