import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class APinchOfPowder extends DrawCard {
    // A Pinch of Powder (11099)
    // Shadow (1).
    // Reaction: After you win an [intrigue] or [power] challenge by 5 or more STR as the attacking
    // player, return attached character to its owner's hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    ['intrigue', 'power'].includes(event.challenge.challengeType)
            },
            message: {
                format: "{player} uses {source} to return {parent} to {controller}'s hand",
                args: {
                    parent: (context) => context.cardStateWhenInitiated.parent,
                    controller: (context) => context.cardStateWhenInitiated.parent.controller
                }
            },
            gameAction: GameActions.returnCardToHand((context) => ({
                card: context.source.parent,
                allowSave: true
            }))
        });
    }
}

APinchOfPowder.code = '11099';

export default APinchOfPowder;
