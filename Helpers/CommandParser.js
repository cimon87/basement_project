"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandEnum_1 = require("../Enums/CommandEnum");
const Command_1 = require("../Models/Command");
const Messages_1 = require("../Statics/Messages");
class CommandParser {
    static Parse(command) {
        let temp = command.trim().split(' ');
        let time = -1;
        if (temp.length > 1) {
            time = parseInt(temp[1]);
        }
        let parsedCommand = CommandEnum_1.CommandEnum[temp[0].toUpperCase()];
        if (parsedCommand == null) {
            throw new Error(Messages_1.Messages.UnknownCommand + command);
        }
        return new Command_1.Command(parsedCommand, time);
    }
}
exports.CommandParser = CommandParser;
//# sourceMappingURL=CommandParser.js.map