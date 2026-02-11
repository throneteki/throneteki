import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBlackGate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice character',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrifice({ faction: 'thenightswatch', type: 'character' })
            ],
            target: {
                location: ['hand', 'shadow'],
                controller: 'current',
                type: 'character',
                condition: (card, context) =>
                    GameActions.putIntoPlay({ card }).allow(context) &&
                    (!context.costs.sacrifice ||
                        (card
                            .getTraits()
                            .some((trait) => context.costs.sacrifice.hasTrait(trait)) &&
                            card.getPrintedCost() <= context.costs.sacrifice.getPrintedCost()))
            },
            message: {
                format: '{player} kneels {costs.kneel} and sacrifices {costs.sacrifice} to put {target} into play from {location}',
                args: {
                    location: (context) =>
                        context.target.location === 'hand' ? 'their hand' : 'shadows'
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheBlackGate.code = '26030';

export default TheBlackGate;
