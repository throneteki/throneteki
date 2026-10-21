import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PriestOnTheDocks extends DrawCard {
    // Priest on the Docks (27023)
    // Reaction: After you win dominance, kill Priest on the Docks to choose a non-limited location
    // or attachment with printed cost 3 or lower and discard it from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) => event.winner === context.player
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
