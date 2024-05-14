const { flatten } = require('../Array');
class SimultaneousEvents {
    constructor() {
        this.childEvents = [];
        this.postHandlers = [];
    }

    get activeChildEvents() {
        return this.childEvents.filter((event) => !event.cancelled);
    }

    addChildEvent(event) {
        event.parentEvent = this;
        this.childEvents.push(event);
    }

    emitTo(emitter, suffix) {
        for (let event of this.activeChildEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    get resolved() {
        return this.childEvents.every((event) => event.resolved);
    }

    get cancelled() {
        return this.childEvents.every((event) => event.cancelled);
    }

    cancel() {
        for (let event of this.activeChildEvents) {
            event.cancel();
        }

        if (this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    checkExecuteValidity() {
        for (let event of this.childEvents) {
            event.checkExecuteValidity();
        }
    }

    executeHandler() {
        for (let event of this.activeChildEvents.sort((a, b) => a.order - b.order)) {
            event.executeHandler();
        }
    }

    executePostHandler() {
        for (let event of this.activeChildEvents) {
            event.executePostHandler();
        }

        for (let postHandler of this.postHandlers) {
            postHandler(this);
        }
    }

    getConcurrentEvents() {
        return this.activeChildEvents.reduce((concurrentEvents, event) => {
            return concurrentEvents.concat(event.getConcurrentEvents());
        }, []);
    }

    getPrimaryEvents() {
        return flatten(this.activeChildEvents.map((event) => event.getPrimaryEvents()));
    }

    thenExecute(func) {
        this.postHandlers.push(func);
        return this;
    }

    toString() {
        return `simultaneous(${this.activeChildEvents.map((e) => e.toString()).join(', ')})`;
    }
}

module.exports = SimultaneousEvents;
