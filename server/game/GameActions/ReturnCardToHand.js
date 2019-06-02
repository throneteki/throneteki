const GameAction = require('./GameAction');

class ReturnCardToHand extends GameAction {
    constructor() {
        super('returnToHand');
    }

    canChangeGameState({ card }) {
        return ['dead pile', 'discard pile', 'play area', 'shadows', 'duplicate'].includes(card.location);
    }

    createEvent({ card, allowSave = true }) {
        let params = {
            card: card,
            allowSave: allowSave,
            automaticSaveWithDupe: true
        };
        return this.event('onCardReturnedToHand', params, event => {
            event.cardStateWhenReturned = card.createSnapshot();
            event.card.controller.moveCard(card, 'hand', { allowSave: allowSave });
        });
    }
}

module.exports = new ReturnCardToHand();
