const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const PlaceCard = require('./PlaceCard');

class ReturnCardToDeck extends GameAction {
    constructor() {
        super('returnCardToDeck');
    }

    canChangeGameState({ card }) {
        return card.location !== 'draw deck';
    }

    createEvent({ card, allowSave = true, bottom = false }) {
        let params = {
            card: card,
            allowSave: allowSave,
            bottom: bottom,
            snapshotName: 'cardStateWhenMoved'
        };
        const returnEvent = this.event('onCardReturnedToDeck', params, event => {
            event.thenAttachEvent(PlaceCard.createEvent({ card: event.card, location: 'draw deck', bottom }));
        });

        if(card.location === 'play area') {
            return this.atomic(returnEvent, LeavePlay.createEvent({ card, allowSave }));
        }

        return returnEvent;
    }
}

module.exports = new ReturnCardToDeck();
