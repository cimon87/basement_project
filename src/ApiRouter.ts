import * as express from 'express';
import { MessagesController } from './Controllers/MessagesController';
import { LogsController } from "./Controllers/LogsController";
import { GpioController } from "./Controllers/GpioController";
import { BasementSecurity } from "./BasementSecurity";
import { Inject } from 'typescript-ioc';
import { SecurityController } from './Controllers/SecurityController';

export class ApiRouter
{
    @Inject
    messagesController : MessagesController;

    @Inject
    logsController : LogsController;

    @Inject
    gpioController : GpioController;

    @Inject
    securityController : SecurityController;

    public Route(app : express.Application) : void
    {
        app.route('/messages/inbox')
            .get((req, res) => this.messagesController.GetInbox(req, res));

        app.route('/messages/send')
            .get((req, res) => this.messagesController.GetSentItems(req, res))
            .post((req, res) => this.messagesController.SendMessage(req, res));

        app.route('/logs')
            .get((req, res) => this.logsController.GetAll(req, res)); 

        app.route('/gpio')
            .get((req, res) => this.gpioController.GetAll(req, res))
            .post((req,res) => this.gpioController.SetState(req, res));

        app.route('/security/status')
            .get((req, res) => this.securityController.Status(req, res))
            .post((req, res) => this.securityController.Switch(req, res));

        app.route('/security/phones')
            .get((req, res) => this.securityController.GetSecurityPhones(req, res))
            .post((req, res) => this.securityController.UpdateSecurityPhones(req, res))
            .put((req, res) => this.securityController.CreateSecurityPhone(req, res));
    }
}