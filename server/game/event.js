const _ = require('underscore');

class Event {
    constructor(name, params, handler = () => true) {
        this.name = name;
        this.cancelled = false;
        this.handler = handler;
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
        return this.allowSave && this.automaticSaveWithDupe && !!(this.card || this.cards);
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

    saveCard(card) {
        if(!this.cards) {
            return;
        }

        this.removeCard(card);
        card.markAsSaved();
        card.game.raiseEvent('onCardSaved', { card: card });
    }

    removeCard(card) {
        if(!this.cards) {
            return;
        }

        this.cards = _.reject(this.cards, c => c === card);

        if(_.isEmpty(this.cards)) {
            this.cancel();
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
}

module.exports = Event;
