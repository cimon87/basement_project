import { GammuDatabase } from "../Gammu/GammuDatabase";

export class MessagesController
{
    public static GetInbox(request, response) 
    {
        var gammu = GammuDatabase.getInstance();
        
        gammu.GetInbox()
            .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }

    public static GetSendItems(request, response) 
    {

    }

    public static SendMessage(request, response)
    {
        var gammu = GammuDatabase.getInstance();

        gammu.SendMessageJSON(request.body)
        .then((result) => {
            response.json(result);
        }).catch((error) =>{
            response.send(error);
        })
    }
}