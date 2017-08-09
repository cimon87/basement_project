"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Credentials {
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
exports.Credentials = Credentials;
//# sourceMappingURL=Credentials.js.map