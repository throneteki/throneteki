const GameAction = require('./GameAction');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class PlaceCard extends GameAction {
    constructor() {
        super('placeCard');
    }

    canChangeGameState({ player, card, location, bottom = false }) {
        player = location === 'play area' ? player || card.controller : card.owner;
        if (location === 'draw deck') {
            return (
                (player.drawDeck[0] !== card && !bottom) ||
                (player.drawDeck[player.drawDeck.length - 1] !== card && bottom)
            );
        }

        return card.location !== location;
    }

    createEvent({ card, player, location, bottom = false, orderable }) {
        return MoveCardEventGenerator.createPlaceCardEvent({
            card,
            player,
            location,
            bottom,
            orderable
        });
    }
}

module.exports = new PlaceCard();
