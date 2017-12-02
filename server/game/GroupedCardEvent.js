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

    replaceCards(newCards) {
        if(newCards.length !== this.childEvents.length) {
            return;
        }

        let index = 0;

        for(let card of newCards) {
            this.childEvents[index].card = card;
            ++index;
        }

        this.cards = newCards;
    }

    onChildCancelled(event) {
        super.onChildCancelled(event);
        this.removeCard(event.card);
    }
}

module.exports = GroupedCardEvent;
