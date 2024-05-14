const DrawCard = require('../../drawcard.js');

class CrownOfGoldenRoses extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lord' });

        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });

        this.action({
            title: 'Give attached character +STR',
            condition: () => this.parent.getNumberOfIcons() >= 1,
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardFromHand(),
            handler: (context) => {
                let strBoost = this.parent.getNumberOfIcons();

                this.untilEndOfPhase((ability) => ({
                    match: this.parent,
                    effect: ability.effects.modifyStrength(strBoost)
                }));

                this.game.addMessage(
                    '{0} uses {1} and discards {2} from their hand to give +{3} STR to {4} until the end of the phase',
                    this.controller,
                    this,
                    context.costs.discardFromHand,
                    strBoost,
                    this.parent
                );
            }
        });
    }
}

CrownOfGoldenRoses.code = '04044';

module.exports = CrownOfGoldenRoses;
