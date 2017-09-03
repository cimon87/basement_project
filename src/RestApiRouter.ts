import * as express from 'express';
import { MessagesController } from './Controllers/MessagesController';
import { LogsController } from "./Controllers/LogsController";
import { GpioController } from "./Controllers/GpioController";
import { BasementSecurity } from "./BasementSecurity";

export class RestApiRouter
{
    public Route(app : express.Application, basementSecurity : BasementSecurity) : void
    {
        var messagesController : MessagesController = new MessagesController();
        var logsController : LogsController = new LogsController();
        var gpioController : GpioController = new GpioController(basementSecurity);

        app.route('/messages/inbox')
            .get(messagesController.GetInbox);

        app.route('/messages/send')
            .get(messagesController.GetSentItems)
            .post(messagesController.SendMessage);

        app.route('/logs')
            .get(logsController.GetAll);

        app.route('/gpio')
            .get(gpioController.GetAll);
    }
}