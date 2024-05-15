import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Summerhall extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStrengthChanged: (event) =>
                    event.amount < 0 && event.card.getStrength() === 0 && event.applying
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {costs.kneel} to kill {character}',
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.kill((context) => ({ card: context.event.card }))
        });
    }
}

Summerhall.code = '25034';

export default Summerhall;
