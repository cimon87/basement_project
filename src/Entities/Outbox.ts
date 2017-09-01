import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

export class Outbox
{
    @PrimaryGeneratedColumn()
    ID	: number;

    @Column()
    UpdatedInDB : Date;

    @Column()
    InsertIntoDB	: Date;

    @Column()
    SendingDateTime	: Date;
    SendBefore	: Date;
    SendAfter	: Date;
    Text : string;
    DestinationNumber	: string;
    Coding	: boolean;
    UDH	: string;
    Class : number;
    TextDecoded	: string;
    MultiPart : boolean;
    RelativeValidity	: number;
    SenderID	: string;
    SendingTimeOut	: Date;
    DeliveryReport	: boolean;
    CreatorID	: string;
}