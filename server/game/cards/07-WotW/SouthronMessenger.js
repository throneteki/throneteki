import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SouthronMessenger extends DrawCard {
    // Southron Messenger (07031)
    // Ambush (5).
    // Reaction: After Southron Messenger enters play during a challenge, choose a participating
    // character with fewer than 2 challenge icons, and return that character to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && context.game.isDuringChallenge()
            },
            target: {
                activePromptTitle: 'Select participating character',
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    card.getNumberOfIcons() <= 1
            },
            message: {
                format: "{player} uses {source} to return {target} to {controller}'s hand",
                args: { controller: (context) => context.target.controller }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

SouthronMessenger.code = '07031';

export default SouthronMessenger;
