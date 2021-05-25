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
            bottom: bottom,
            snapshotName: 'cardStateWhenMoved'
        };
        return this.event('onCardReturnedToDeck', params, event => {
            event.card.controller.moveCard(card, 'draw deck', { bottom: bottom, allowSave: allowSave });
        });
    }
}

module.exports = new ReturnCardToDeck();
