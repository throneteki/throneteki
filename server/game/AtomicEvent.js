class AtomicEvent {
    constructor() {
        this.cancelled = false;
        this.invalid = false;
        this.childEvents = [];
        this.attachedEvents = [];
        this.params = {};
    }

    get resolved() {
        return !this.cancelled && this.childEvents.every(event => event.resolved);
    }

    addChildEvent(event) {
        this.params = Object.assign({}, event.params, this.params);
        Object.assign(this, this.params);

        event.parent = this;
        this.childEvents.push(event);
    }

    emitTo(emitter, suffix) {
        for(let event of this.childEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    allowAutomaticSave() {
        return false;
    }

    cancel() {
        this.cancelled = true;

        for(let event of this.childEvents) {
            // Disassociate the child with the parent so that indirect calls to
            // onChildCancelled are not made. This will prevent an infinite loop.
            event.parent = null;
            event.cancel();
        }

        this.childEvents = [];

        if(this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    replaceHandler(handler) {
        if(this.childEvents.length !== 0) {
            this.childEvents[0].replaceHandler(handler);
        }
    }

    checkExecuteValidity() {
        for(let event of this.childEvents) {
            event.checkExecuteValidity();
        }
    }

    executeHandler() {
        for(let event of this.childEvents.sort((a, b) => a.order - b.order)) {
            event.executeHandler();
        }
    }

    executePostHandler() {
        for(let event of this.childEvents) {
            event.executePostHandler();
        }
    }

    onChildCancelled(event) {
        this.childEvents = this.childEvents.filter(e => e !== event);
        this.cancel();
    }

    getConcurrentEvents() {
        return this.childEvents.reduce((concurrentEvents, event) => concurrentEvents.concat(event.getConcurrentEvents()), []);
    }

    getPrimaryEvents() {
        return [this.childEvents[0]];
    }

    thenExecute(func) {
        this.childEvents[0].thenExecute(func);
        return this;
    }

    toString() {
        return `atomic(${this.childEvents.map(e => e.toString()).join(' + ')})`;
    }
}

module.exports = AtomicEvent;
