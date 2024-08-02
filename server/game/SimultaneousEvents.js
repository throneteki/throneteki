import { flatten } from '../Array.js';
class SimultaneousEvents {
    constructor() {
        this.childEvents = [];
        this.postHandlers = [];
        this.order = 0;
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
        this.queue = this.getConcurrentEvents().sort((a, b) => a.order - b.order);

        for (let event of this.queue) {
            event.createSnapshot();
            if (!event.invalid) {
                event.handler(event);
            }
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

export default SimultaneousEvents;
