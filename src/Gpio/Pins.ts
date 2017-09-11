export class Pins
{
    public static LED : string = 'GPIO18'; 
    public static SECURITY_SWITCH : string = 'GPIO21';
    public static CONTACTON : string = 'GPIO5';
    public static SIREN : string = 'GPIO20';

    public static GetDescription(pin : string)
    {
        switch (pin) {
            case Pins.LED:
                return "LED";
            case Pins.SIREN:
                return "Siren";
            case Pins.CONTACTON:
                return "Door";
            case Pins.SECURITY_SWITCH:
                return "Security Switch";
            default:
                return "Unknown";
        }
    }

}