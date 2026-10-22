import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterAtTheRock extends DrawCard {
    // Maester at the Rock (08010)
    // Reaction: After you play a [lannister] event, kneel Maester at the Rock to move that event
    // from your discard pile to the top of your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.isFaction('lannister') &&
                    event.card.controller === context.player &&
                    event.card.location === 'discard pile'
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to place {card} on top of their deck',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.returnCardToDeck((context) => ({ card: context.event.card }))
        });
    }
}

MaesterAtTheRock.code = '08010';

export default MaesterAtTheRock;
