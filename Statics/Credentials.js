"use strict";
exports.__esModule = true;
var Credentials = (function () {
    function Credentials() {
    }
    Credentials.MySQLEventsCredentials = {
        host: "localhost",
        user: "zongji",
        password: ""
    };
    Credentials.MySQLCredentials = {
        host: Credentials.MySQLEventsCredentials.host,
        user: Credentials.MySQLEventsCredentials.user,
        password: Credentials.MySQLEventsCredentials.password,
        database: "gammu"
    };
    return Credentials;
}());
exports.Credentials = Credentials;
