import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Reinstatement extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a character into play',
            phase: 'standing',
            target: {
                type: 'select',
                cardCondition: {
                    type: 'character',
                    trait: 'Small Council',
                    location: 'discard pile',
                    controller: 'current'
                }
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to put {target} into play from their discard pile',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

Reinstatement.code = '26038';

export default Reinstatement;
