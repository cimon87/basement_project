"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Phones_1 = require("../Statics/Phones");
const Messages_1 = require("../Statics/Messages");
const GenericResult_1 = require("../Models/GenericResult");
class PhoneVerificator {
    IsOurPhone(number) {
        let genericResult = new GenericResult_1.GenericResult();
        let found = Phones_1.Phones.Admins.Any(x => x.Phone === number);
        if (!found) {
            genericResult.Message = Messages_1.Messages.UnknownNumberMessage + number;
        }
        return genericResult;
    }
}
exports.PhoneVerificator = PhoneVerificator;
//# sourceMappingURL=PhoneVerificator.js.map