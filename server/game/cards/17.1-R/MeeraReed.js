import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MeeraReed extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Winter'))
            },
            message: '{player} is forced to return {source} to shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.source }))
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: { type: 'character', location: 'play area' }
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

MeeraReed.code = '17123';

export default MeeraReed;
