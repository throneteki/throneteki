import DrawCard from '../../drawcard.js';

class GreyguardArtisan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: { type: 'attachment', location: 'play area' }
            },
            message:
                '{player} uses {source} to treat the text box of {target} as blank until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });
    }
}

GreyguardArtisan.code = '26089';

export default GreyguardArtisan;
