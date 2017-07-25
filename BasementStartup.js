"use strict";
exports.__esModule = true;
var BasementSecurity_1 = require("./BasementSecurity");
var BasementStartup = (function () {
    function BasementStartup() {
    }
    BasementStartup.Main = function () {
        this.basementSecurity = new BasementSecurity_1.BasementSecurity();
        this.basementSecurity.Run();
    };
    return BasementStartup;
}());
BasementStartup.Main();
