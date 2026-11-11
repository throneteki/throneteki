import GameActions from '../../GameActions/index.js';
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
            condition: (context) => context.source.parent.getNumberOfIcons() >= 1,
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardFromHand(),
            message: {
                format: '{player} uses {source} and discards {costs.discardFromHand} from their hand to give +{strBoost} STR to {parent} until the end of the phase',
                args: {
                    strBoost: (context) => context.source.parent.getNumberOfIcons(),
                    parent: (context) => context.source.parent
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source.parent,
                effect: ability.effects.modifyStrength(context.source.parent.getNumberOfIcons())
            }))
        });
    }
}

CrownOfGoldenRoses.code = '04044';

export default CrownOfGoldenRoses;
