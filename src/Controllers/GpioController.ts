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

    public GetAll(request, response)
    {
        response.json(this.gpioRegistry.All());
    }
}