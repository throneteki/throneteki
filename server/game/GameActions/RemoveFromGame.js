const GameAction = require('./GameAction');
const LeavePlay = require('./LeavePlay');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class RemoveFromGame extends GameAction {
    constructor() {
        super('removeFromGame');
    }

    canChangeGameState({ card }) {
        return card.location !== 'out of game';
    }

    createEvent({ card, player, allowSave = true }) {
        player = player || card.controller;
        const params = {
            allowSave,
            card,
            player,
            snapshotName: 'cardStateWhenRemoved'
        };
        const removeEvent = this.event('onCardRemovedFromGame', params, (event) => {
            event.thenAttachEvent(
                MoveCardEventGenerator.createPlaceCardEvent({
                    card: event.card,
                    player: event.player,
                    location: 'out of game'
                })
            );
        });

        if (['play area', 'duplicate'].includes(card.location)) {
            return this.atomic(removeEvent, LeavePlay.createEvent({ card, allowSave }));
        }

        return removeEvent;
    }
}

module.exports = new RemoveFromGame();
