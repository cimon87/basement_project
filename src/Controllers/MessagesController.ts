import { GammuDatabase } from "../Gammu/GammuDatabase";
import { Inject } from "typescript-ioc";

export class MessagesController
{
    @Inject
    gammu : GammuDatabase;
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
        this.gammu.SendMessageJSON(request.body)
        .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }
}