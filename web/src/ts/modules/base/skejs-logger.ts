"use strict";
export class SkejsLog {
    brand : string;
    error(errorMessage) : void {
        console.error(`%c${this.brand} error: ${errorMessage}`, `color: white`);
    }
    constructor(brand="Skejs") {
        this.brand = brand;
    }
}

const sl = new SkejsLog();