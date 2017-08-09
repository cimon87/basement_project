"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandEnum_1 = require("../Enums/CommandEnum");
const GenericOnOffExecutor_1 = require("./GenericOnOffExecutor");
class CommandExecutorsFactory {
    static GetExecutor(command) {
        let commandExecutor;
        switch (command.Command) {
            case CommandEnum_1.CommandEnum.OFF:
            case CommandEnum_1.CommandEnum.ON:
                commandExecutor = new GenericOnOffExecutor_1.GenericOnOffExecutor(command);
        }
        return commandExecutor;
    }
}
exports.CommandExecutorsFactory = CommandExecutorsFactory;
//# sourceMappingURL=CommandExecutorsFactory.js.map