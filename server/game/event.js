class Event {
    constructor(name, params) {
        this.name = name;
        this.params = params;
        this.cancelled = false;
        this.shouldSkipHandler = false;
    }

    cancel() {
        this.cancelled = true;
    }

    skipHandler() {
        this.shouldSkipHandler = true;
    }
}

module.exports = Event;
