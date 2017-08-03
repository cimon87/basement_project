"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandEnum_1 = require("../Enums/CommandEnum");
var GenericOnOffExecutor_1 = require("./GenericOnOffExecutor");
var CommandExecutorsFactory = (function () {
    function CommandExecutorsFactory() {
    }
    CommandExecutorsFactory.GetExecutor = function (command) {
        var commandExecutor;
        switch (command.Command) {
            case CommandEnum_1.CommandEnum.OFF:
            case CommandEnum_1.CommandEnum.ON:
                commandExecutor = new GenericOnOffExecutor_1.GenericOnOffExecutor(command);
        }
        return commandExecutor;
    };
    return CommandExecutorsFactory;
}());
exports.CommandExecutorsFactory = CommandExecutorsFactory;
