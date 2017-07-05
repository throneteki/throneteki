const DrawCard = require('../../../drawcard.js');

class SilencesCrew extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['gold'] * 2)
        });

        this.reaction({
            when: {
                onPillage: (event, challenge, card, discarded) => card === this && 
                                                                  (discarded.getType() === 'location' || discarded.getType() === 'attachment')
            },
            handler: () => {
                this.addToken('gold', 1);
                this.game.addMessage('{0} moves 1 gold token from the treasury to {1}', this.controller, this);
            }
        });
    }
}

SilencesCrew.code = '06071';

module.exports = SilencesCrew;
