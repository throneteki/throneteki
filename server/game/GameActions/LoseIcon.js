const GameAction = require('./GameAction');

class LoseIcon extends GameAction {
    constructor() {
        super('loseIcon');
    }

    canChangeGameState({ card }) {
        return card.location === 'play area' && card.getType() === 'character';
    }

    createEvent({ card, icon, applying = true }) {
        return this.event('onIconLost', { card, icon, applying }, () => {
            card.removeIcon(icon);
        });
    }
}

module.exports = new LoseIcon();
