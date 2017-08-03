"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raspi_gpio_1 = require("raspi-gpio");
var Start = (function () {
    function Start() {
    }
    Start.Run = function () {
        //let command = new Command(CommandEnum.ON, 5)
        //let executor = new GenericOnOffExecutor(command);
        //executor.Execute();
        this.dig = new raspi_gpio_1.DigitalOutput('GPIO18');
        this.dig.write(1);
    };
    Start.prototype.SIGINT = function () {
        process.on('SIGINT', function () {
            Start.dig.write(0);
        });
    };
    return Start;
}());
Start.Run();
