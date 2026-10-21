import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheThroneOfDorne extends DrawCard {
    // The Throne of Dorne (25028)
    // Reaction: After you lose dominance, kneel The Throne of Dorne to place a [martell] card you
    // control in shadows.
    // +1 Reserve.
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner && this.controller !== event.winner
            },
            cost: ability.costs.kneelSelf(),
            target: {
                type: 'select',
                cardCondition: {
                    location: 'play area',
                    faction: 'martell',
                    controller: 'current',
                    condition: (card) => GameActions.putIntoShadows({ card }).allow()
                }
            },
            message: '{player} kneels {costs.kneel} to place {target} in shadows',
            handler: (context) => {
                context.game.resolveGameAction(
                    GameActions.putIntoShadows((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheThroneOfDorne.code = '25028';

export default TheThroneOfDorne;
