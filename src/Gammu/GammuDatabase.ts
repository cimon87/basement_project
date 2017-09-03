import { Credentials } from '../Statics/Credentials';
import { Logger } from '../Logger/Logger';
import { Phones } from '../Statics/Phones';
import { Promise } from 'es6-promise';
import * as MySQL from 'mysql';
import * as MySQLEvents from 'mysql-events';


class GammuDatabase
{
    private _inputListener : (param : any) => void;
    private _eventsCredentials : any;
    private _connection : MySQL.IConnection;
    private _mysqlEvents : MySQLEvents.MySQLEvents;
    private _logger : Logger;

    private static _instance:GammuDatabase = new GammuDatabase();

    constructor() {
        if(GammuDatabase._instance){
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }

        this._logger = new Logger("log.log");
        GammuDatabase._instance = this;
    }
    
    public static getInstance():GammuDatabase
    {
        return GammuDatabase._instance;
    }

    public AddListener(inputListener : (param : any) => void) {
        this._inputListener = inputListener;
        
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

    public SendMessageJSON(jsonDeserialized : any) : Promise<any>
    {
        return new Promise((resolve, reject) =>{
            if(this._connection == null)
                {
                    throw new Error('Not connected to database');    
                }

                if(jsonDeserialized.to == null || jsonDeserialized.text == null)
                {
                    reject("Values not set");
                }
        
                this._connection.query("INSERT INTO outbox (DestinationNumber, TextDecoded) VALUES ('"+ jsonDeserialized.to +"','" + jsonDeserialized.text + "');",
                (error, results, fields) => {
                if (error) {
                    this._logger.error(error.stack);
                    reject(error.stack);
                }
                else{
                    resolve(results);
                }
            })
        });
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

    public GetInbox() : any
    {
        return new Promise((resolve, reject) => {
            var query = this._connection.query('SELECT ID, SenderNumber, TextDecoded, ReceivingDateTime FROM inbox ORDER BY ReceivingDateTime DESC', (error, results, fields) => {
                if (error) {
                    reject(error.stack);
                }
                else{
                    resolve(results);
                }
            });     
        });
    }

    public GetSentItems() :  Promise<any>
    {
        return new Promise((resolve, reject) => {
            var query = this._connection.query('SELECT UpdatedInDB, InsertIntoDB, SendingDateTime, DestinationNumber, SMSCNumber, TextDecoded, ID, Status  FROM sentitems ORDER BY UpdatedInDB DESC', (error, results, fields) => {
                if (error) {
                    reject(error.stack);
                }
                else{
                    resolve(results);
                }
            });     
        });
    }

    public AttachListener() : void
    {
        this._mysqlEvents = MySQLEvents(Credentials.MySQLEventsCredentials);

        this._mysqlEvents.add(
        'gammu.inbox',
        (oldRow : any, newRow : any, event : any) => {
            this._logger.log('Message from: ' + newRow.fields.SenderNumber + " Text: " + newRow.fields.TextDecoded);   
            if(this._inputListener != null)
            {
                this._inputListener(newRow);    
            }
        }
        );
    }
}

export { GammuDatabase };