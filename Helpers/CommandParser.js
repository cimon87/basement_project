"use strict";
exports.__esModule = true;
var Command = (function () {
    function Command(command, time) {
        this.Command = command;
        this.Time = time;
    }
    return Command;
}());
var CommandParser = (function () {
    function CommandParser() {
    }
    CommandParser.Parse = function (command) {
        var temp = command.trim().split(' ');
        var time = -1;
        if (temp.length > 1) {
            time = parseInt(temp[1]);
        }
        return new Command(temp[0].toUpperCase(), time);
    };
    return CommandParser;
}());
exports.CommandParser = CommandParser;
