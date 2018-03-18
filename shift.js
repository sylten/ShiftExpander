'use strict';
var Gpio = require('pigpio').Gpio;
var led = new Gpio(4, {mode: Gpio.OUTPUT});

const PIN_DATA = 22;
const PIN_LATCH = 27;
const PIN_CLOCK = 17;

var pins = {
    data: new Gpio(22, {mode: Gpio.OUTPUT}),
    latch: new Gpio(27, {mode: Gpio.OUTPUT}),
    clock: new Gpio(17, {mode: Gpio.OUTPUT})
}

function shiftout(byte) {
    pins.latch.digitalWrite(0);
    for (let i = 0; i < 8; i++) {
        pins.data.digitalWrite((byte >> i) & 1);
        pins.clock.digitalWrite(1);
        pins.clock.digitalWrite(0);
    }
    pins.latch.digitalWrite(1);
}

let out = 0;
function setPin(pin, v) {
    let n = 0;
    for (let i = 0; i < 8; i++) {
        if (i === pin - 1) {
            n |= (v << i);
        } else {
            n |= ((out >> i) & 1) << i;
        }
    }
    out = n;
    shiftout(out);
}

shiftout(0);

let y = 1;
let interval = setInterval(() => {
    setPin(y, 1);
    if (y > 1) setPin(y-1,0); else setPin(8, 0);
    y++;
    if (y > 8) y = 1;
}, 100);

//setPin(2,1);
//setPin(8,1);
/*
let x = 0b00010001;
let interval = setInterval(() => {
    shiftout(x);
    x = x << 1;
    if ((x >> 4) & 1) x = 0b00010001;
}, 100);
*/