"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Gpio = require("raspi-gpio");
var CommandEnum_1 = require("../Enums/CommandEnum");
var GenericOnOffExecutor = (function () {
    function GenericOnOffExecutor(command) {
        this.LED_GPIO = 18;
        this.command = command;
        this.LedGpio = new Gpio.DigitalOutput('GPIO18');
    }
    GenericOnOffExecutor.prototype.Execute = function () {
        var _this = this;
        if (this.command.Command == CommandEnum_1.CommandEnum.ON) {
            this.LedGpio.write(1);
            if (this.command.Time > 0) {
                setTimeout(function () {
                    _this.LedGpio.write(0);
                }, 1000 * this.command.Time);
            }
        }
        else if (this.command.Command == CommandEnum_1.CommandEnum.OFF) {
            this.LedGpio.write(0);
        }
    };
    return GenericOnOffExecutor;
}());
exports.GenericOnOffExecutor = GenericOnOffExecutor;
