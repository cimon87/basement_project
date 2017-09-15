import { BasementSecurity } from "../BasementSecurity";
import { AutoWired, Inject, Singleton} from "typescript-ioc";
import { GpioRegistry } from "../Gpio/GpioRegistry";
import { IController } from "./IController";

export class GpioController implements IController
{
    @Inject
    public gpioRegistry : GpioRegistry;

    constructor()
    {
    }

    public GetAll(request, response):void
    {
        response.json(this.gpioRegistry.All());
    }

    public SetState(request, response) : void
    {
        if(request.body.State != null && request.body.PinName)
        {
            try
            {
                this.gpioRegistry.SetGpioState(request.body.PinName, Number(request.body.State));
                response.json(this.gpioRegistry.All())
            }
            catch(Error)
            {
                console.log(Error.message);
                response.json(Error.message);
            }
        }
        else
        {
            response.send("Object properties not set properly");
        }
    }
}