import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Aggo extends DrawCard {
    // Aggo (03035)
    // Action: If there is a Summer plot card revealed, choose and stand a Bloodrider character.
    // (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a Bloodrider',
            condition: (context) => context.game.anyPlotHasTrait('Summer'),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Bloodrider')
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Aggo.code = '03035';

export default Aggo;
