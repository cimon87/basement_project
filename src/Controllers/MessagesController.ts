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

    public static GetOutbox(request, response) 
    {

    }
}