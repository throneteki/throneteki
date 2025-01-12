import { flatten } from '../Array.js';

/**
 * A Simultaneous Event groups multiple events into a single window without affecting eachother.
 * - Cancelling this event will cancel all children events, but cancelling a child event will not cancel any others.
 * - Child events will intentionally have no parent.
 * - This event will be "resolved" if all child events resolved successfully.
 * - This event will be "cancelled" if all child events were cancelled.
 */
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

    executeHandler() {
        // Execute as concurrent events so they can be ordered appropriately at the highest level
        this.queue = this.getConcurrentEvents().sort((a, b) => a.order - b.order);

        for (let event of this.queue) {
            event.createSnapshot();
            event.handler(event);
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
