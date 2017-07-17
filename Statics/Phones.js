"use strict";
exports.__esModule = true;
var Phone_1 = require("../Models/Phone");
var Phones = (function () {
    function Phones() {
    }
    Phones.Admins = [
        new Phone_1.Phone('+48603705226', 'Marcin'),
        new Phone_1.Phone('+48784027936', 'Gosia')
    ];
    return Phones;
}());
exports.Phones = Phones;
