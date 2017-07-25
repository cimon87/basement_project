"use strict";
exports.__esModule = true;
var CommandEnum_1 = require("../Enums/CommandEnum");
var Command_1 = require("../Models/Command");
var CommandParser = (function () {
    function CommandParser() {
    }
    CommandParser.Parse = function (command) {
        var temp = command.trim().split(' ');
        var time = -1;
        if (temp.length > 1) {
            time = parseInt(temp[1]);
        }
        return new Command_1.Command(CommandEnum_1.CommandEnum[temp[0].toUpperCase()], time);
    };
    return CommandParser;
}());
exports.CommandParser = CommandParser;
