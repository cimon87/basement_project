import { MessagesController } from './Controllers/MessagesController';
import { BasementSecurity } from './BasementSecurity';
import { RestApiRouter } from './RestApiRouter';
import * as express from 'express';
import * as bodyParser from 'body-parser';

class RestApiBasement
{
    private port: string | number;
    private app: express.Application;
    private security : BasementSecurity;

    constructor()
    {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.security = new BasementSecurity();
        this.security.Run();
    }

    public Start()
    {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        var router = new RestApiRouter();
        router.Route(this.app);

        this.app.listen(this.port);

        console.log('RESTful API server started on: ' + this.port);
    }
}

var api = new RestApiBasement();
api.Start();


