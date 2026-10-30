import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GreyguardArtisan extends DrawCard {
    // Greyguard Artisan (26089)
    // Shadow (2).
    // Reaction: After Greyguard Artisan comes out of shadows, choose an attachment. Until the end
    // of the phase, treat that attachment as if its printed text box were blank (except for
    // Traits).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: { type: 'attachment', location: 'play area' }
            },
            message:
                '{player} uses {source} to treat the text box of {target} as blank until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }
}

GreyguardArtisan.code = '26089';

export default GreyguardArtisan;
