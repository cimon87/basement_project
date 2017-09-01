import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

export class Inbox
{
    @PrimaryGeneratedColumn()
    ID : number;

    @Column()
    UpdatedInDB : Date;

    @Column()
    ReceivingDateTime : Date;

    @Column()
    Text : string;

    @Column()
    SenderNumber : string;

    @Column()
    Coding : string;

    @Column()
    UDH : string;

    @Column()
    SMSCNumber : string;

    @Column()
    Class : number;

    @Column()
    TextDecoded : string;

    @Column()
    RecipientID : string;

    @Column()
    Processed : boolean;
}