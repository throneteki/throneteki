import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHound extends DrawCard {
    // The Hound (09029)
    // No attachments except Weapon.
    // Reaction: After The Hound enters play, choose a Knight character without attachments and
    // return it to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Knight') &&
                    card.attachments.length === 0
            },
            message: "{player} uses {source} to return {target} to its owner's hand",
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

TheHound.code = '09029';

export default TheHound;
