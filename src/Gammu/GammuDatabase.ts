import { Credentials } from '../Statics/Credentials';
import { Logger } from '../Logger/Logger';
import { Phones } from '../Statics/Phones';
import { Promise } from 'es6-promise';
import * as MySQL from 'mysql';
import * as MySQLEvents from 'mysql-events';
import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { sequelize, SecurityPhone, SentItems } from './Models';

@Singleton
@AutoWired
class GammuDatabase
{
    private _inputListener : (param : any) => void;
    private _eventsCredentials : any;
    private _connection : MySQL.IConnection;
    private _mysqlEvents : MySQLEvents.MySQLEvents;
    private sequelize : any;

    @Inject
    private _logger : Logger;

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
                    let message = 'Not connected to database';
                    this._logger.error(message);
                    throw new Error();    
                }

                if(jsonDeserialized.to == null || jsonDeserialized.text == null)
                {
                    let message = 'Props to and text not set';
                    this._logger.error(message);
                    reject(message);
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
            else{
                this._logger.log("Sent to " + to + ": " + text + " ");
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
        return SentItems.findAll({ order: 
            [ 
                ['UpdatedInDB', 'DESC'] 
            ] 
        });
    }

    public GetSecurityPhones() :  Promise<any>
    {
        return SecurityPhone.findAll();
    }

    public UpdateSecurityPhone(data): any {
        if(this._connection == null)
        {
            throw new Error('Not connected to database');    
        }

        this._connection.query("UPDATE security_phone SET Receive=" + data.Receive + ", Send=" + data.Send + " WHERE Number='" + data.Number + "'",
        (error, results, fields) => {
            if (error) {
                this._logger.error(error.stack);
            }
            else{
                this._logger.log("Updated database with: " + JSON.stringify(data));
            }
        });
    }
    public CreateSecurityPhone(data): any {
        if(this._connection == null)
        {
            throw new Error('Not connected to database');    
        }

        this._connection.query("INSERT INTO security_phone(Receive, Send, Number) VALUES (" + data.Receive + "," + data.Send + ",'" + data.Number + "')",
        (error, results, fields) => {
            if (error) {
                this._logger.error(error.stack);
            }
            else{
                this._logger.log("Inserted database with: " + JSON.stringify(data));
            }
        });
    }

    public DeleteSecurityPhone(number): any {
        if(this._connection == null)
        {
            throw new Error('Not connected to database');    
        }

        this._connection.query("DELETE FROM security_phone WHERE Number='" + number + "'",
        (error, results, fields) => {
            if (error) {
                this._logger.error(error.stack);
            }
            else{
                this._logger.log("Deleted item with number: " + number);
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
            if(this._inputListener != null)
            {
                this._inputListener(newRow);    
            }
        }
        );
    }
}

export { GammuDatabase };