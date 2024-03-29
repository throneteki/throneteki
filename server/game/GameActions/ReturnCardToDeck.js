const Message = require('../Message');
const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');

class ReturnCardToDeck extends GameAction {
    constructor() {
        super('returnCardToDeck');
    }

    message({ card, bottom }) {
        return Message.fragment('places {card} on {position} of their deck', { card, position: bottom ? 'the bottom' : 'top' });
    }

    canChangeGameState({ card }) {
        if(card.location === 'play area' && !LeavePlay.allow({ card })) {
            return false;
        }

        return card.location !== 'draw deck';
    }

    createEvent({ card, allowSave = true, bottom = false, orderable }) {
        let params = {
            card: card,
            allowSave: allowSave,
            bottom: bottom,
            snapshotName: 'cardStateWhenMoved'
        };
        const returnEvent = this.event('onCardReturnedToDeck', params, event => {
            event.thenAttachEvent(PlaceCard.createEvent({ card: event.card, location: 'draw deck', bottom, orderable }));
        });

        if(card.location === 'play area') {
            return this.atomic(returnEvent, LeavePlay.createEvent({ card, allowSave }));
        }

        return returnEvent;
    }
}

module.exports = new ReturnCardToDeck();
