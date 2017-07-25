"use strict";
exports.__esModule = true;
var Phones_1 = require("../Statics/Phones");
var Messages_1 = require("../Statics/Messages");
var GenericResult_1 = require("../Models/GenericResult");
var PhoneVerificator = (function () {
    function PhoneVerificator() {
    }
    PhoneVerificator.prototype.IsOurPhone = function (number) {
        var genericResult = new GenericResult_1.GenericResult();
        var found = Phones_1.Phones.Admins.Any(function (x) { return x.Phone === number; });
        if (!found) {
            genericResult.Message = Messages_1.Messages.UnknownNumberMessage + number;
        }
        return genericResult;
    };
    return PhoneVerificator;
}());
exports.PhoneVerificator = PhoneVerificator;
