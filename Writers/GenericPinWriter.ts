import { DigitalInput } from 'raspi-gpio';
import { List } from "linqts/dist/linq";

export class GenericPinWriter
{
    constructor(pinString: string) {
        this.pin = new DigitalInput(pinString)

        this.listeners = new List<(state: number) => void>();
    }
    
    public pin: DigitalInput;
    private listeners : List<(state: number) => void>;

    AttachListener(listener: (state: number) => void) {
        this.listeners.Add(listener);
    }

    Listen() {
        this.pin.addListener('change', (state) => {
            this.listeners.ForEach((listener) => {
                listener(state);
            })
        })
    }
}