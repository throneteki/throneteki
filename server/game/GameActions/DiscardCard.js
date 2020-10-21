const GameAction = require('./GameAction');

class DiscardCard extends GameAction {
    constructor() {
        super('discard');
    }

    canChangeGameState({ card }) {
        return ['draw deck', 'hand', 'play area', 'shadows', 'duplicate'].includes(card.location);
    }

    createEvent({ card, allowSave = true, isPillage = false, source }) {
        let params = {
            card: card,
            allowSave: allowSave,
            automaticSaveWithDupe: true,
            originalLocation: card.location,
            isPillage: !!isPillage,
            source: source,
            snapshotName: 'cardStateWhenDiscarded'
        };
        return this.event('onCardDiscarded', params, event => {
            event.card.controller.moveCard(event.card, 'discard pile');
        });
    }
}

module.exports = new DiscardCard();
