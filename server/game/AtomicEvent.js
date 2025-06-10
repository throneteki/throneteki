/**
 * An Atomic Event groups multiple events into a single window, with properties & processes being shared.
 * - Cancelling this event, or any child events, will cancel all children events.
 * - Child events will have this event as it's parent.
 * - This event will be "resolved" if it was not cancelled & all child events resolved successfully.
 */
class AtomicEvent {
    constructor() {
        this.cancelled = false;
        this.childEvents = [];
        this.attachedEvents = [];
        this.params = {};
        this.order = 0;
    }

    get resolved() {
        return !this.cancelled && this.childEvents.every((event) => event.resolved);
    }

    addChildEvent(event) {
        this.params = Object.assign({}, event.params, this.params);
        Object.assign(this, this.params);

        event.parent = this;
        this.childEvents.push(event);
    }

    emitTo(emitter, suffix) {
        for (let event of this.childEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    allowAutomaticSave() {
        return false;
    }

    cancel() {
        this.cancelled = true;

        for (let event of this.childEvents) {
            // Disassociate the child with the parent so that indirect calls to
            // onChildCancelled are not made. This will prevent an infinite loop.
            event.parent = null;
            event.cancel();
        }

        this.childEvents = [];

        if (this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    /**
     * Replaces the first child event by name, or first child event that matches function, with a new event
     */
    replaceChildEvent(nameOrFunc, newEvent) {
        const findFunc =
            typeof nameOrFunc === 'string' ? (event) => event.name === nameOrFunc : nameOrFunc;

        // Check primary events to safely include simultaneous & atomic
        const childIndex = this.childEvents.findIndex((event) =>
            event.getPrimaryEvents().some(findFunc)
        );
        if (childIndex >= 0) {
            // Clear the old events parent first
            this.childEvents[childIndex].parent = null;
            this.childEvents.splice(childIndex, 1);
            this.addChildEvent(newEvent);
            return true;
        }
        return false;
    }

    replaceHandler(handler) {
        if (this.childEvents.length !== 0) {
            this.childEvents[0].replaceHandler(handler);
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
        for (let event of this.childEvents) {
            event.executePostHandler();
        }
    }

    onChildCancelled(event) {
        this.childEvents = this.childEvents.filter((e) => e !== event);
        this.cancel();
    }

    getConcurrentEvents() {
        return this.childEvents.reduce(
            (concurrentEvents, event) => concurrentEvents.concat(event.getConcurrentEvents()),
            []
        );
    }

    getPrimaryEvents() {
        return [this.childEvents[0]];
    }

    thenExecute(func) {
        this.childEvents[0].thenExecute(func);
        return this;
    }

    toString() {
        return `atomic(${this.childEvents.map((e) => e.toString()).join(' + ')})`;
    }
}

export default AtomicEvent;
