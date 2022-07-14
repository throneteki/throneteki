const GameAction = require('./GameAction');

class RevealCard extends GameAction {
    constructor() {
        super('revealCard');
    }

    canChangeGameState({ card }) {
        return ['draw deck', 'hand', 'plot deck', 'shadows'].includes(card.location);
    }

    createEvent({ card }) {
        return this.event('onCardRevealed', { card }, () => {
            card.game.addMessage('{0} has been revealed from {1}\'s {2}', card, card.controller, card.location);
            // TODO: There's a theoretical future UI where we prominently display
            // the revealed card, add a reveal effect and pause for all players
            // to acknowledge it, etc. But until then, this event does nothing.
        });
    }
}

module.exports = new RevealCard();
