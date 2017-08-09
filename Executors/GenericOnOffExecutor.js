"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gpio = require("raspi-gpio");
const CommandEnum_1 = require("../Enums/CommandEnum");
const Pins_1 = require("../Statics/Pins");
class GenericOnOffExecutor {
    constructor(command) {
        this.LED_GPIO = 18;
        this.command = command;
        this.LedGpio = new Gpio.DigitalOutput(Pins_1.Pins.LED);
    }
    Execute() {
        if (this.command.Command == CommandEnum_1.CommandEnum.ON) {
            this.LedGpio.write(1);
            if (this.command.Time > 0) {
                setTimeout(() => {
                    this.LedGpio.write(0);
                }, 1000 * this.command.Time);
            }
        }
        else if (this.command.Command == CommandEnum_1.CommandEnum.OFF) {
            this.LedGpio.write(0);
        }
    }
}
exports.GenericOnOffExecutor = GenericOnOffExecutor;
//# sourceMappingURL=GenericOnOffExecutor.js.map