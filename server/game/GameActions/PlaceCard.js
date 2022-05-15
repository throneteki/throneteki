const GameAction = require('./GameAction');
const MoveCardEventGenerator = require('./MoveCardEventGenerator');

class PlaceCard extends GameAction {
    constructor() {
        super('placeCard');
    }

    canChangeGameState({ card, location }) {
        if(location === 'draw deck') {
            return true;
        }

        return card.location !== location;
    }

    createEvent({ card, player, location, bottom = false }) {
        return MoveCardEventGenerator.createPlaceCardEvent({ card, player, location, bottom });
    }
}

module.exports = new PlaceCard();
