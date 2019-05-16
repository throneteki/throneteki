const GameAction = require('./GameAction');

class DiscardCard extends GameAction {
    constructor() {
        super('discard');
    }

    canChangeGameState({ card }) {
        return ['draw deck', 'hand', 'play area', 'shadows', 'duplicate'].includes(card.location);
    }

    createEvent({ card, player, allowSave = true, isPillage = false, source }) {
        let params = {
            card: card,
            player: player || card.controller,
            allowSave: allowSave,
            automaticSaveWithDupe: true,
            originalLocation: card.location,
            isPillage: !!isPillage,
            source: source
        };
        return this.event('onCardDiscarded', params, event => {
            event.cardStateWhenDiscarded = event.card.createSnapshot();
            event.player.moveCard(event.card, 'discard pile');
        });
    }
}

module.exports = new DiscardCard();
