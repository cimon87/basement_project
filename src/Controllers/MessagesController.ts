import { GammuDatabase } from "../Gammu/GammuDatabase";

export class MessagesController
{
    public GetInbox(request, response) : void
    {
        let gammu = GammuDatabase.getInstance();

        gammu.GetInbox()
            .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }

    public GetSentItems(request, response) : void
    {
        let gammu = GammuDatabase.getInstance();

        gammu.GetSentItems()
        .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }

    public SendMessage(request, response) : void
    {
        let gammu = GammuDatabase.getInstance();

        gammu.SendMessageJSON(request.body)
        .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }
}