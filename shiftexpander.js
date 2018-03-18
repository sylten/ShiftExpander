'use strict';
const Gpio = require('pigpio').Gpio;

class PinType {
    set(value) { }
}

class GpioPin extends PinType {
    constructor(pin) {
	super();
        this.pin = new Gpio(pin, { mode: Gpio.OUTPUT });
    }
    set(value) {
        this.pin.digitalWrite(value);
    }
}

class ShiftExpanderPin extends PinType {
    constructor(pin, ioExpander) {
	super();
        this.pin = pin;
        this.ioExpander = ioExpander;
    }
    set(value) {
        this.ioExpander.setOne(this.pin, value);
    }
}

class ShiftExpander {
    constructor(dataPin, latchPin, clockPin, outputCount) {
        this.current = 0;
        this.outputCount = outputCount || 8;

        this.pins = {
            data: dataPin,
            latch: latchPin,
            clock: clockPin
        };
    }

    set(byte) {
        this.current = byte
        this.pins.latch.set(0);
        for (let i = 0; i < 8; i++) {
            this.pins.data.set((byte >> i) & 1);
            this.pins.clock.set(1);
            this.pins.clock.set(0);
        }
        this.pins.latch.set(1);
    }

    setOne(pin, value) {
        // if (pin < 0 || pin > this.outputCount - 1) {
        //     throw new Error('Unrecognized pin');
        // }

        // if (value !== 0 && value !== 1) {
        //     throw new Error('Can only output 0 or 1');
        // }

        let b = 0;
        
        for (let i = 0; i < 8; i++) {
            if (i === pin - 1) {
                b |= (value << i);
            } else {
                b |= ((this.current >> i) & 1) << i;
            }
        }

        this.set(b);
    }
}

module.exports = {
    GpioPin: GpioPin,
    ShiftExpanderPin: ShiftExpanderPin,
    ShiftExpander: ShiftExpander
};
