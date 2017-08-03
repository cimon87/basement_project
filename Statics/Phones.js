"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Phone_1 = require("../Models/Phone");
var linqts_1 = require("linqts");
var Phones = (function () {
    function Phones() {
    }
    Phones.Admins = new linqts_1.List([
        new Phone_1.Phone('+48603705226', 'Marcin'),
        new Phone_1.Phone('+48784027936', 'Gosia')
    ]);
    Phones.Commands = [];
    return Phones;
}());
exports.Phones = Phones;
