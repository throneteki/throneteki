const DrawCard = require('../../drawcard.js');

class JanosSlynt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to give Janos Slynt +2 strength',
            cost: ability.costs.payGold(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} pays 1 gold to give {1} +2 STR until the end of the phase',
                    context.player,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

JanosSlynt.code = '04010';

module.exports = JanosSlynt;
