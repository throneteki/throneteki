import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RedwyneMerchanter extends DrawCard {
    // Redwyne Merchanter (26076)
    // Shadow (1).
    // Reaction: After Redwyne Merchanter comes out of shadows, choose a character. Until the end of
    // the phase, that character gets +2 STR.
    // +1 Income
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character'
                }
            },
            message: '{player} uses {source} to give {target} +2 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

RedwyneMerchanter.code = '26076';

export default RedwyneMerchanter;
