class AtomicEvent {
    constructor() {
        this.cancelled = false;
        this.childEvents = [];
    }

    addChildEvent(event) {
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

    onChildCancelled(event) {
        this.childEvents = this.childEvents.filter(e => e !== event);
        this.cancel();
    }

    getConcurrentEvents() {
        return this.childEvents.reduce((concurrentEvents, event) => concurrentEvents.concat(event.getConcurrentEvents()), []);
    }

    getPrimaryEvent() {
        return this.childEvents[0];
    }
}

module.exports = AtomicEvent;
