import DrawCard from '../../drawcard.js';

class RedwyneMerchanter extends DrawCard {
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
