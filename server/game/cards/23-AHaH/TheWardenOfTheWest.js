import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWardenOfTheWest extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', trait: 'Lord' });

        this.whileAttached({
            effect: [ability.effects.addTrait('Commander'), ability.effects.addKeyword('Renown')]
        });

        this.reaction({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.cardStateWhenDiscarded.controller,
                        location: event.cardStateWhenDiscarded.location
                    }),
                    condition: (aggregate) =>
                        aggregate.controller !== this.controller &&
                        ['hand', 'draw deck'].includes(aggregate.location)
                }
            },
            limit: ability.limit.perRound(1),
            message: {
                format: '{player} uses {source} to draw {amount} cards',
                args: { amount: (context) => context.events.length }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.events.length
            }))
        });
    }
}

TheWardenOfTheWest.code = '23006';

export default TheWardenOfTheWest;
