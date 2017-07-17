var settings = require("./MySQLSettings");
var mysql = require("mysql");
var MySQLEvents = require('mysql-events');
var adminPhones = require('./AdminPhones');
var Logger = require("./Logger/Logger").Logger

var _logger = new Logger("mysql.log");

function GammuDatabase(inputListener){
    this._dsn = {
        host:     settings.Hostname,
        user:     "zongji",
        password: ""
    };

    this._inputListener = inputListener;
    this._connection = null;
    this._mysqlEvents = null;
}

GammuDatabase.prototype.AttachListener = function(){
    var that = this;
    this._mysqlEvents = MySQLEvents(this._dsn);

    this._inboxEvent = this._mysqlEvents.add(
    'gammu.inbox',
            function (oldRow, newRow, event) {
                _logger.log('Message from: ' + newRow.fields.SenderNumber + " Text: " + newRow.fields.TextDecoded);   
                that._inputListener(newRow);
            }
    );
};

GammuDatabase.prototype.SendMessage = function(to, text){
    this._connection.query("INSERT INTO outbox (DestinationNumber, TextDecoded) VALUES ('"+ to +"','" + text + "');", function (error, results, fields) {
        if (error) {
            _logger.error(error.stack);
        }
    });
}

GammuDatabase.prototype.Connect = function(){
    var that = this;

    this._connection =  mysql.createConnection({
        host     : that._dsn.host,
        user     : that._dsn.user,
        password : that._dsn.password,
        database : settings.Database
    });

    this._connection.connect(function(err){
        if(err){
            _logger.error('error', 'error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + that._connection.threadId);

        that.AttachListener();
    })
}

GammuDatabase.prototype.Disconnect = function() {
    this._mysqlEvents.stop();
    this._connection.end();
} 

module.exports = GammuDatabase;
