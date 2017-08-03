"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GenericResult = (function () {
    function GenericResult() {
        this.Message = "";
    }
    GenericResult.prototype.IsSuccess = function () {
        return this.Message === "";
    };
    ;
    return GenericResult;
}());
exports.GenericResult = GenericResult;
