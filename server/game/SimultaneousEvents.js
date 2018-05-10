class SimultaneousEvents {
    constructor() {
        this.childEvents = [];
    }

    addChildEvent(event) {
        this.childEvents.push(event);
    }

    emitTo(emitter, suffix) {
        for(let event of this.childEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    get cancelled() {
        return this.childEvents.every(event => event.cancelled);
    }

    cancel() {
        for(let event of this.childEvents) {
            event.cancel();
        }

        if(this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    executeHandler() {
        for(let event of this.childEvents) {
            event.executeHandler();
        }
    }

    executePostHandler() {
        for(let event of this.childEvents) {
            event.executePostHandler();
        }
    }

    getConcurrentEvents() {
        return this.childEvents.reduce((concurrentEvents, event) => {
            return concurrentEvents.concat(event.getConcurrentEvents());
        }, []);
    }

    getPrimaryEvent() {
        return this.childEvents[0];
    }

    toString() {
        return `simultaneous(${this.childEvents.map(e => e.toString()).join(', ')})`;
    }
}

module.exports = SimultaneousEvents;
