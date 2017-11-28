const _ = require('underscore');

class Event {
    constructor(name, params, handler = () => true, postHandler = () => true) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.postHandler = postHandler;
        this.childEvents = [];

        _.extend(this, params);
        this.params = [this].concat([params]);
    }

    addChildEvent(event) {
        event.parent = this;
        this.childEvents.push(event);
    }

    emitTo(emitter, suffix) {
        let fullName = suffix ? `${this.name}:${suffix}` : this.name;
        emitter.emit(fullName, this);

        for(let event of this.childEvents) {
            event.emitTo(emitter, suffix);
        }
    }

    allowAutomaticSave() {
        return this.allowSave && this.automaticSaveWithDupe && !!this.card;
    }

    cancel() {
        this.cancelled = true;

        for(let event of this.childEvents) {
            event.cancel();
        }

        if(this.parent) {
            this.parent.onChildCancelled(this);
        }
    }

    replaceHandler(handler) {
        this.handler = handler;
    }

    executeHandler() {
        this.handler(this);

        for(let event of this.childEvents) {
            event.executeHandler();
        }
    }

    executePostHandler() {
        this.postHandler(this);
    }

    onChildCancelled(event) {
        this.childEvents = this.childEvents.filter(e => e !== event);
    }

    getConcurrentEvents() {
        return this.childEvents.reduce((concurrentEvents, event) => {
            return concurrentEvents.concat(event.getConcurrentEvents());
        }, [this]);
    }

    getPrimaryEvent() {
        return this;
    }
}

module.exports = Event;
