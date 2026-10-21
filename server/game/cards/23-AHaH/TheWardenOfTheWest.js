import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWardenOfTheWest extends DrawCard {
    // The Warden of the West (23006)
    // [lannister] Lord character only.
    // Attached character gains the Commander trait and renown.
    // Reaction: After 1 or more cards are discarded from an opponent's hand or deck during a
    // challenge in which attached character is participating, draw that many cards. (Limit once per
    // round.)
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
                    condition: (aggregate, events, context) =>
                        aggregate.controller !== context.source.controller &&
                        ['hand', 'draw deck'].includes(aggregate.location) &&
                        !!context.source.parent &&
                        context.source.parent.isParticipating()
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
