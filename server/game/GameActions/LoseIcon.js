import GameAction from './GameAction.js';

class LoseIcon extends GameAction {
    constructor() {
        super('loseIcon');
    }

    canChangeGameState({ card, applying = true }) {
        //when the effect is applying, check if the card´s location is play area
        //when the effect is unapplying, skip the check for the location as we want the effect to be removed in any case
        let playAreaCheck = applying ? card.location === 'play area' : true;
        return playAreaCheck && card.getType() === 'character';
    }

    createEvent({ card, icon, applying = true }) {
        return this.event('onIconLost', { card, icon, applying }, () => {
            card.removeIcon(icon);
        });
    }
}

export default new LoseIcon();
