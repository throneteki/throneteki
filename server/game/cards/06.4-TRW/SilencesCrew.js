const DrawCard = require('../../drawcard.js');

class SilencesCrew extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['gold'] * 2)
        });

        this.reaction({
            when: {
                onPillage: event => event.source === this &&
                                    (event.discardedCard.getType() === 'location' || event.discardedCard.getType() === 'attachment')
            },
            handler: () => {
                this.modifyToken('gold', 1);
                this.game.addMessage('{0} moves 1 gold token from the treasury to {1}', this.controller, this);
            }
        });
    }
}

SilencesCrew.code = '06071';

module.exports = SilencesCrew;
