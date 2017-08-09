"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Phone_1 = require("../Models/Phone");
const linqts_1 = require("linqts");
class Phones {
}
Phones.Admins = new linqts_1.List([
    new Phone_1.Phone('+48603705226', 'Marcin'),
    new Phone_1.Phone('+48784027936', 'Gosia')
]);
Phones.Commands = [];
exports.Phones = Phones;
//# sourceMappingURL=Phones.js.map