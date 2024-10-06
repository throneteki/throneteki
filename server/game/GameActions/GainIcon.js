import GameAction from './GameAction.js';

class GainIcon extends GameAction {
    constructor() {
        super('gainIcon');
    }

    canChangeGameState({ card, applying = true }) {
        // Checks if effect is either unapplying (which could happen in or out of play), or character is in play area
        return card.getType() === 'character' && (!applying || card.location === 'play area');
    }

    createEvent({ card, icon, applying = true }) {
        return this.event('onIconGained', { card, icon, applying }, () => {
            card.addIcon(icon);
        });
    }
}

export default new GainIcon();
