import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AlyceGraceford extends DrawCard {
    // Alyce Graceford (13063)
    // Action: Kneel Alyce Graceford to choose another The Seven character. Until the end of the
    // phase, that character gains renown.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give renown',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('The Seven')
            },
            message: '{player} kneels {source} to give {target} renown until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('renown')
            }))
        });
    }
}

AlyceGraceford.code = '13063';

export default AlyceGraceford;
