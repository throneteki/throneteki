import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DeepwoodMotte extends DrawCard {
    // Deepwood Motte (25102)
    // Reaction: After a Winter plot card is revealed, kneel Deepwood Motte to choose and kneel
    // another non-limited location.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: (event) => event.plot.hasTrait('Winter')
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: {
                    type: 'location',
                    location: 'play area',
                    limited: false,
                    condition: (card) => card !== this
                }
            },
            message: '{player} kneels {costs.kneel} to kneel {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kneelCard((context) => ({ card: context.target, source: this })),
                    context
                );
            }
        });
    }
}

DeepwoodMotte.code = '25102';

export default DeepwoodMotte;
