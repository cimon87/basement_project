import { Credentials } from '../Statics/Credentials';
import { Logger } from '../Logger/Logger';
import { Phones } from '../Statics/Phones';
import { Promise } from 'es6-promise';
import * as MySQL from 'mysql';
import * as MySQLEvents from 'mysql-events';
import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { sequelize, SecurityPhone, SentItems, Inbox, Outbox} from './Models';
import Sequelize from 'sequelize';

@Singleton
@AutoWired
class GammuDatabase
{
    private _inputListener : (param : any) => void;
    private _eventsCredentials : any;
    private _connection : MySQL.IConnection;
    private _mysqlEvents : MySQLEvents.MySQLEvents;
    private sequelize : Sequelize;

    @Inject
    private _logger : Logger;

    public AddListener(inputListener : (param : any) => void) {
        this._inputListener = inputListener;
        
    }

    public Connect() : void
    {
        this.AttachListener();  
    }

    public Disconnect() : void
    {
        this._mysqlEvents.stop();
        this._connection.end();
        this.sequelize.close();
    } 

    public SendMessage(to: string, text: string) : Promise<any>
    {
        return Outbox.create({ DestinationNumber: to, TextDecoded: text })
                .then(result => {
                    this._logger.log("Sent to " + to + ": " + text + " ");
                })
                .catch(error => {
                    this._logger.error(error);
                })
    }

    public GetInbox() : Promise<any>
    {
        return Inbox.findAll({ order: 
            [ 
                ['ReceivingDateTime', 'DESC'] 
            ] 
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

    public GetSecurityPhoneByNumber(number:string): Promise<any>
    {
        return SecurityPhone.findAll({ where : { Number : number }});
    }

    public UpdateSecurityPhone(data): Promise<any> {

        return SecurityPhone.update({Receive: data.Receive, Send:data.Send}, {where: { Number: data.Number }})
        .then(result => {
            this._logger.log("Updated database with: " + JSON.stringify(data));
        })
        .catch(error => {
            this._logger.error(error);
        });
    }

    public CreateSecurityPhone(data): Promise<any> {

        return SecurityPhone.create(data)
            .then(result => {
                this._logger.log("Inserted database with: " + JSON.stringify(data));
            })
            .catch(error => {
                this._logger.error(error.stack);
            })
    }

    public DeleteSecurityPhone(number): Promise<any> {

        return SecurityPhone.destroy({ where: { Number: number } })
        .then(result => {
            this._logger.log("Deleted item with number: " + number);
        })
        .catch(error => {
            this._logger.error(error);
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