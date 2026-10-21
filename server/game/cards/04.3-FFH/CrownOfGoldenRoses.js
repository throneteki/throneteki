import DrawCard from '../../drawcard.js';

class CrownOfGoldenRoses extends DrawCard {
    // Crown of Golden Roses (04044)
    // Lord character only.
    // Attached character gains the King trait.
    // Action: Discard 1 card from your hand to give attached character +X STR until the end of the
    // phase. X is the number of challenge icons attached character has. (Limit twice per round.)
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

export default CrownOfGoldenRoses;
