import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class RhymesWithMeek extends DrawCard {
    // Rhymes With Meek (11112)
    // Shadow (0).
    // Reaction: After you win an unopposed challenge, draw 2 cards (3 cards instead if you played
    // this event from shadows).
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ winner: context.source.controller, unopposed: true })
            },
            message: {
                format: '{player} plays {source} to draw {cards}',
                args: {
                    cards: (context) =>
                        TextHelper.count(
                            context.cardStateWhenInitiated.location === 'shadows' ? 3 : 2,
                            'card'
                        )
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.cardStateWhenInitiated.location === 'shadows' ? 3 : 2
            }))
        });
    }
}

RhymesWithMeek.code = '11112';

export default RhymesWithMeek;
