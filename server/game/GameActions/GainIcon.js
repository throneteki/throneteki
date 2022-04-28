const GameAction = require('./GameAction');

class GainIcon extends GameAction {
    constructor() {
        super('gainIcon');
    }

    canChangeGameState({ card }) {
        return card.location === 'play area' && card.getType() === 'character';
    }

    createEvent({ card, icon, applying = true }) {
        return this.event('onIconGained', { card, icon, applying }, () => {
            card.addIcon(icon);
        });
    }
}

module.exports = new GainIcon();
