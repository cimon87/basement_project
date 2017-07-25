import { Phone } from '../Models/Phone';
import { List } from 'linqts';

export class Phones{
    public static Admins : List<Phone> = new List<Phone>([
        new Phone('+48603705226', 'Marcin'),
        new Phone('+48784027936', 'Gosia')
    ]);

    public static Commands : any = [
        
    ]
}