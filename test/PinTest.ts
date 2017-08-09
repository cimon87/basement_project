// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
import * as Gpio from 'raspi-gpio';
import * as chai from 'chai';
import { Pins } from "../Statics/Pins";

@suite class PinTest {

    public gpio : Gpio.DigitalOutput;

    @test SetHIGH18() {
        this.gpio  = new Gpio.DigitalOutput(Pins.LED);
        this.gpio.write(0);
    }

    @test(slow(2000), timeout(4000)) destroyer() {
        this.gpio.write(0);
    }
}