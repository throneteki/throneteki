import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MarshsConspirator extends DrawCard {
    // Marsh's Conspirator (25049)
    // Shadow (2).
    // Reaction: After Marsh's Conspirator comes out of shadows, choose a character. Until the end
    // of the phase, treat that character as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
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

MarshsConspirator.code = '25049';

export default MarshsConspirator;
