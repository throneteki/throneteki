const _ = require('underscore');

class Event {
    constructor(name, params, handler = () => true, postHandler = () => true) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
        this.postHandlers = [postHandler];
        this.childEvents = [];
        this.attachedEvents = [];

        _.extend(this, params);
        this.params = params;
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

    saveCard() {
        if(!this.card || this.cancelled) {
            return;
        }

        this.card.game.saveCard(this.card);
        this.cancel();
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
        for(let postHandler of this.postHandlers) {
            postHandler(this);
        }
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

    thenAttachEvent(event) {
        this.attachedEvents.push(event);
    }

    thenExecute(func) {
        this.postHandlers.push(func);
        return this;
    }

    clearAttachedEvents() {
        for(let event of this.attachedEvents) {
            this.addChildEvent(event);
        }
        this.attachedEvents = [];
    }

    toString() {
        if(this.childEvents.length !== 0) {
            return `${this.name} + children(${this.childEvents.map(e => e.toString()).join(', ')})`;
        }

        return this.name;
    }
}

module.exports = Event;
