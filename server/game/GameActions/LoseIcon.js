import GameAction from './GameAction.js';

class LoseIcon extends GameAction {
    constructor() {
        super('loseIcon');
    }

    canChangeGameState({ card, applying = true }) {
        // Checks if effect is either unapplying (which could happen in or out of play), or character is in play area
        return card.getType() === 'character' && (!applying || card.location === 'play area');
    }

    createEvent({ card, icon, applying = true }) {
        return this.event('onIconLost', { card, icon, applying }, () => {
            card.removeIcon(icon);
        });
    }
}

export default new LoseIcon();
