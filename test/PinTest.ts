// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
import * as Gpio from 'raspi-gpio';
import * as chai from 'chai';
import { Pins } from "../src/Statics/Pins";

@suite class PinTest {

    public gpio : Gpio.DigitalOutput; 

    @test SetHIGH18() {
        this.gpio  = new Gpio.DigitalOutput("GPIO18");
        this.gpio.write(1);

        timeout(500000);
        this.gpio.write(0);
    }
}