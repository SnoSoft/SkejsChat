class SkejsLog {
    error(errorMessage) {
        console.error(`%c${this.brand} error: ${errorMessage}`, `color: white`);
    }
    constructor(brand="Skejs") {
        this.brand = brand;
    }
}

const sl = new SkejsLog();