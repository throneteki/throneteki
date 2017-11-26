const _ = require('underscore');

class Event {
    constructor(name, params) {
        this.name = name;
        this.cancelled = false;
        this.replacementHandler = null;

        _.extend(this, params);
        this.params = [this].concat([params]);
    }

    emitTo(emitter, suffix) {
        let fullName = suffix ? `${this.name}:${suffix}` : this.name;
        emitter.emit(fullName, this);
    }

    allowAutomaticSave() {
        return this.allowSave && this.automaticSaveWithDupe && !!(this.card || this.cards);
    }

    cancel() {
        this.cancelled = true;
    }

    replaceHandler(handler) {
        this.replacementHandler = handler;
    }

    executeHandler(handler) {
        if(this.replacementHandler) {
            this.replacementHandler(...this.params);
        } else {
            handler(...this.params);
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
}

module.exports = Event;
