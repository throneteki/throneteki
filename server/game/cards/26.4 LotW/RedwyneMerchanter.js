import DrawCard from '../../drawcard.js';

class RedwyneMerchanter extends DrawCard {
    // Redwyne Merchanter (26076)
    // Shadow (1).
    // Reaction: After Redwyne Merchanter comes out of shadows, choose a character. Until the end of
    // the phase, that character gets +2 STR.
    // +1 Income
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character'
                }
            },
            message: '{player} uses {source} to give {target} +2 STR until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

RedwyneMerchanter.code = '26076';

export default RedwyneMerchanter;
