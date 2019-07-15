const DrawCard = require('../../drawcard.js');

class KnightsOfTheMind extends DrawCard {
    setupCardAbilities() {
        this.action({
            handler: () => {
                this.game.addMessage('{0} plays {1} to give each Maester character a military icon until the end of the phase', this.controller, this);
                this.untilEndOfPhase(ability => ({
                    match: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Maester') && card.controller === this.controller,
                    effect: ability.effects.addIcon('military')
                }));
            }
        });
    }
}

KnightsOfTheMind.code = 'TODO';

module.exports = KnightsOfTheMind;
