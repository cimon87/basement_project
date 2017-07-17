var Gammu = require("./GammuDatabase");
var phones = require('./Statics/Phones').Phones;
var Commands = require('./commands');
var CommandParser = require('./Helpers/CommandParser').CommandParser;
var Logger = require("./Logger/Logger").Logger;
var _ = require('lodash');
var Gpio = require('onoff').Gpio;

this.led = new Gpio(18, 'out');
this.logger = new Logger('generic.log');

var that = this;

var outboxHandler = function(newRow){
    var found = false;

    for(let element of phones.Admins) {
            if(newRow.fields.SenderNumber === element.Phone)
            {
                var nowDate = new Date();
                nowDate.setMinutes(nowDate.getMinutes() - 2);

                that.logger.log(newRow.fields.UpdatedInDB);

                if(newRow.fields.UpdatedInDB >= nowDate)
                {
                    found = true;
                    that.ProcessMessage(element.Phone, newRow.fields.TextDecoded);
                }
                else
                {
                    that.logger.log('Message is outdated from: '  + element.Phone + " Text: " + newRow.fields.TextDecoded);
                }
            }
    };

    if(!found)
    {
        that.logger.log('New message from unknown number:' + newRow.fields.SenderNumber);
    }
};

that.ProcessMessage = function(senderNumber, senderText)
{
    var foundCommand = false;

    Commands.forEach(function(element){
        if(senderText.toUpperCase().indexOf(element.Name.toUpperCase()) == 0){
            var parsedCommand = CommandParser.Parse(senderText);

            if(typeof that[parsedCommand.Command] === 'function')
            {
                foundCommand = true;
                parsedCommand.SenderNumber = senderNumber;
                parsedCommand.SenderText = senderText;

                that[parsedCommand.Command](parsedCommand);
            }
        }
    });

    if(!foundCommand)
    {
        gammu.SendMessage(senderNumber, 'Unknown command:' + senderText);
    }
}

that.OFF = function(parsedCommand)
{
    gammu.SendMessage(parsedCommand.SenderNumber, 'Ok alarm turned off');
    that.led.writeSync(0);
}

that.ON = function(parsedCommand)
{
    gammu.SendMessage(parsedCommand.SenderNumber, 'Ok alarm turned on');
    that.led.writeSync(1);

    if(parsedCommand.Time > 0)
    {
        setTimeout(function(){
            that.led.writeSync(0);
        }, parsedCommand.Time * 1000);
    }
}

that.ALM = function(parsedCommand)
{
    gammu.SendMessage(parsedCommand.SenderNumber, 'Ok siren ringing!');
}

var gammu = new Gammu(outboxHandler);
gammu.Connect();

process.on('SIGINT', function(){
    gammu.Disconnect();
    that.led.writeSync(0);
});