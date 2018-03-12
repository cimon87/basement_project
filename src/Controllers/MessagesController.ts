import { GammuDatabase } from "../Gammu/GammuDatabase";
import { Inject } from "typescript-ioc";
import { Logger } from "../Logger/Logger";

export class MessagesController
{
    @Inject
    private gammu : GammuDatabase;

    @Inject
    private _logger : Logger;

    public GetInbox(request, response) : void
    {
        this.gammu.GetInbox()
            .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }

    public GetSentItems(request, response) : void
    {
        this.gammu.GetSentItems()
        .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }

    public SendMessage(request, response) : void
    {
        if(request.body.to == null || request.body.text == null)
        {
            let message = 'Properties to and text not set';
            this._logger.error(message);
            response.send(message);
        }

        this.gammu.SendMessage(request.body.to, request.body.text)
        .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }
}