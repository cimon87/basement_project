"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const raspi_gpio_1 = require("raspi-gpio");
class Start {
    static Run() {
        //let command = new Command(CommandEnum.ON, 5)
        //let executor = new GenericOnOffExecutor(command);
        //executor.Execute();
        this.dig = new raspi_gpio_1.DigitalOutput('GPIO18');
        this.dig.write(1);
    }
    SIGINT() {
        process.on('SIGINT', () => {
            Start.dig.write(0);
        });
    }
}
Start.Run();
//# sourceMappingURL=Sample.js.map