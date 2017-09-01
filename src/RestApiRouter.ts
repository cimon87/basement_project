import * as express from 'express';
import { MessagesController } from './Controllers/MessagesController';

export class RestApiRouter
{
    public Route(app : express.Application) : void
    {
        app.route('/messages/inbox')
            .get(MessagesController.GetInbox);

        app.route('/messages/outbox')
        .get(MessagesController.GetOutbox)
        .post(MessagesController.SendMessage);
    }
}