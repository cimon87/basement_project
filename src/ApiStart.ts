import {AutoWired, Inject, Singleton} from "typescript-ioc";
import { MessagesController } from './Controllers/MessagesController';
import { BasementSecurity } from './BasementSecurity';
import { ApiRouter } from './ApiRouter';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Exec from 'child_process';
import { Server } from "http";

class RestApiBasement
{
    @Inject
    public Security : BasementSecurity;

    private http: Server;
    private port: string | number;
    private app: express.Application;

    constructor()
    {
        this.Security.Run();

        this.app = express();
        this.port = process.env.PORT || 3000;

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        var router = new ApiRouter();
        router.Route(this.app);
    }

    public Start() : void
    {
        this.http = this.app.listen(this.port);
        this.ListenOnExit();

        console.log('API started on: ' + this.port);
    }

    public Dispose() : void
    {
        this.http.close(); 
        this.Security.Dispose(); 

        Exec.exec('sudo rm /var/run/pigpio.pid', function()
        {    
            process.exit();
        });
    }

    public ListenOnExit(): void 
    {
        process.on('SIGUSR2',  () => {
            this.Dispose();
        });

        process.on('SIGINT',  () => {
            this.Dispose();
        });

        process.on('SIGQUIT',  () => {
            this.Dispose();
        });

        process.on('SIGABRT',  () => {
            this.Dispose();
        });

        process.on('SIGTERM',  () => {
            this.Dispose();
        });
    }
}

var api = new RestApiBasement();
api.Start();



