import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RedKeepSpy extends DrawCard {
    // Red Keep Spy (05012)
    // Ambush (4).
    // Reaction: After Red Keep Spy enters play using ambush, choose a character with printed cost 3
    // or lower. If you have more cards in hand than that character's controller, return it to its
    // owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.playingType === 'ambush' && context.source === event.card
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller !== context.source.controller &&
                    card.controller.getHandCount() < context.source.controller.getHandCount() &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3
            },
            message: {
                format: "{player} uses {source} to return {target} to {controller}'s hand",
                args: { controller: (context) => context.target.controller }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

RedKeepSpy.code = '05012';

export default RedKeepSpy;
