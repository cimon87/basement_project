import { Credentials } from '../Statics/Credentials';
import { Logger } from '../Logger/Logger';
import { Phones } from '../Statics/Phones';
import * as MySQL from 'mysql';
import * as MySQLEvents from 'mysql-events';

class GammuDatabase
{
    private _inputListener : (param : any) => void;
    private _eventsCredentials : any;
    private _connection : MySQL.IConnection;
    private _mysqlEvents : MySQLEvents.MySQLEvents;
    private _logger : Logger;

    constructor(inputListener : (param : any) => void) {
        this._inputListener = inputListener;
        this._logger = new Logger("mysql.log");
    }

    public Connect() : void
    {
        this._connection = MySQL.createConnection(Credentials.MySQLCredentials);

        this._connection.connect((error : any) => {
            if(error){
                this._logger.error('error connecting: ' + error.stack);
                return;
            }

            console.log('connected as id ' + this._connection.threadId);
            this.AttachListener();
        })
    }

    public Disconnect() : void
    {
        this._mysqlEvents.stop();
        this._connection.end();
    } 

    public SendMessage(to: string, text: string) : void
    {
        if(this._connection == null)
        {
            throw new Error('Not connected to database');    
        }

        this._connection.query("INSERT INTO outbox (DestinationNumber, TextDecoded) VALUES ('"+ to +"','" + text + "');",
        (error, results, fields) => {
        if (error) {
            this._logger.error(error.stack);
        }
    });
    }

    public AttachListener() : void
    {
        this._mysqlEvents = MySQLEvents(Credentials.MySQLEventsCredentials);

        this._mysqlEvents.add(
        'gammu.inbox',
        (oldRow : any, newRow : any, event : any) => {
            this._logger.log('Message from: ' + newRow.fields.SenderNumber + " Text: " + newRow.fields.TextDecoded);   
            this._inputListener(newRow);
        }
        );
    }
}

export { GammuDatabase };