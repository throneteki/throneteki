import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PriestOnTheDocks extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => event.winner === this.controller
            },
            cost: ability.costs.killSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    ['location', 'attachment'].includes(card.getType()) &&
                    !card.hasKeyword('limited') &&
                    card.getPrintedCost() <= 3
            },
            message: '{player} kills {costs.kill} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

PriestOnTheDocks.code = '27023';

export default PriestOnTheDocks;
