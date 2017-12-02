const Event = require('./event.js');

class GroupedCardEvent extends Event {
    allowAutomaticSave() {
        return false;
    }

    saveCard(card) {
        this.removeCard(card);
        card.markAsSaved();
        card.game.raiseEvent('onCardSaved', { card: card });
    }

    removeCard(card) {
        this.cards = this.cards.filter(c => c !== card);

        let primaryEvents = this.childEvents.map(event => event.getPrimaryEvent());
        for(let event of primaryEvents) {
            if(event.card === card) {
                event.cancel();
            }
        }

        if(this.cards.length === 0) {
            this.cancel();
        }
    }

    onChildCancelled(event) {
        super.onChildCancelled(event);
        this.removeCard(event.card);
    }
}

module.exports = GroupedCardEvent;
