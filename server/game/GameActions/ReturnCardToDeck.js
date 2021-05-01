const GameAction = require('./GameAction');

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
            automaticSaveWithDupe: true,
            bottom: bottom
        };
        return this.event('onCardReturnedToDeck', params, event => {
            event.cardStateWhenMoved = card.createSnapshot();
            event.card.controller.moveCard(card, 'draw deck', { bottom: bottom, allowSave: allowSave });
        });
    }
}

module.exports = new ReturnCardToDeck();
