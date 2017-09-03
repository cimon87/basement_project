import * as fs from 'fs';

export class LogsController
{
    public GetAll(request, response) : void
    {
        var filename = "logs/log.log";
        try{
            fs.accessSync(filename);

            let buffer = fs.readFileSync(filename);
            response.send(buffer);
        }
        catch(e)
        {
            response.json(e)
        }
    }
}