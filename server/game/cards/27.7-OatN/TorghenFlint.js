import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TorghenFlint extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealed: (event) => event.plot.hasTrait('Winter')
            },
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Clansman')
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to put {target} into play from their hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TorghenFlint.code = '27561';
TorghenFlint.version = '1.0.0';

export default TorghenFlint;
