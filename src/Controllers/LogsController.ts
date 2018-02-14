import * as fs from 'fs';

export class LogsController
{
    public GetAll(request, response) : void
    {
        var filename = "logs/log.log";
        try{
            var allLogs = [];
            var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(filename)
            });
            
            lineReader.on('line', function (line) {
                allLogs.push(JSON.parse(line));
            });

            lineReader.on('close', function() {
                response.send(allLogs);
            });
        }
        catch(e)
        {
            response.json(e)
        }
    }
}