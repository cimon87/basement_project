"use strict";
exports.__esModule = true;
var GammuDatabase_1 = require("./Gammu/GammuDatabase");
var BasementSecurity = (function () {
    function BasementSecurity() {
    }
    BasementSecurity.prototype.Run = function () {
        this.gammu = new GammuDatabase_1.GammuDatabase(this.NewMessageHandler);
        this.gammu.Connect();
    };
    BasementSecurity.prototype.NewMessageHandler = function (newRow) {
    };
    BasementSecurity.prototype.SIGINT = function () {
        var _this = this;
        process.on('SIGINT', function () {
            _this.gammu.Disconnect();
        });
    };
    return BasementSecurity;
}());
exports.BasementSecurity = BasementSecurity;
