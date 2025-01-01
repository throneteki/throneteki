import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TywinLannister extends DrawCard {
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
            gameAction: GameActions.choose({
                title: 'Select which card to discard',
                // TODO: Add message
                choices: (context) => this.buildChoices(context)
            })
        });
    }

    buildChoices(context) {
        const topCards = context.aggregate.controller.drawDeck.slice(0, 2);
        return topCards.reduce((choices, card) => {
            choices[card.uuid] = {
                card,
                gameAction: GameActions.genericHandler(() => {
                    const event = context.events[0];
                    const currentEvent = event.childEvents[0];
                    const { player, location, bottom, orderable } = currentEvent;
                    const newEvent = GameActions.placeCard({
                        card,
                        player,
                        location,
                        bottom,
                        orderable
                    }).createEvent();

                    event.replaceChildEvent((event) => event === currentEvent, newEvent);
                })
            };
            return choices;
        }, {});
    }
}

TywinLannister.code = '05006';

export default TywinLannister;
