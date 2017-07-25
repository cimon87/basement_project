"use strict";
exports.__esModule = true;
var GenericResult = (function () {
    function GenericResult() {
    }
    GenericResult.prototype.IsSuccess = function () {
        return typeof this.Message != 'undefined' && this.Message != null;
    };
    ;
    return GenericResult;
}());
exports.GenericResult = GenericResult;
