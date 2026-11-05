import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TywinLannister extends DrawCard {
    // Tywin Lannister (05006)
    // Pillage.
    // Interrupt: When exactly 1 card is discarded from a player's deck, instead look at the top 2
    // cards of that player's deck and discard 1.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.card.controller,
                        location: event.originalLocation
                    }),
                    condition: (aggregate, events) =>
                        events.length === 1 && aggregate.location === 'draw deck'
                }
            },
            message: {
                format: "{player} uses {source} to look at the top 2 cards of {discardingPlayer}'s deck and discard 1",
                args: { discardingPlayer: (context) => context.aggregate.controller }
            },
            gameAction: GameActions.chooseCards({
                title: 'Select which card to discard',
                revealTargets: true,
                cardCondition: (card, context) =>
                    context.aggregate.controller.drawDeck.slice(0, 2).includes(card),
                gameAction: (card, context) =>
                    GameActions.changeEventCard({ event: context.events[0], card })
            })
        });
    }
}

TywinLannister.code = '05006';

export default TywinLannister;
