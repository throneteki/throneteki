import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SpearsOfTheMerlingKing extends DrawCard {
    // Spears of the Merling King (06048)
    // Interrupt: When a character you control is killed, sacrifice Spears of the Merling King to
    // return that character to your hand instead of placing it in your dead pile.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card.controller === context.player
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to return {card} to their hand',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.placeCard({ card: context.event.card, location: 'hand' })
            }))
        });
    }
}

SpearsOfTheMerlingKing.code = '06048';

export default SpearsOfTheMerlingKing;
