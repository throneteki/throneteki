import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class InsidiousScheme extends DrawCard {
    // Insidious Scheme (05023)
    // Reaction: After claim is applied for an [intrigue] challenge you won by 5 or more STR, draw 2
    // cards. (4 cards instead if the losing opponent has no cards in his or her hand.)
    setupCardAbilities() {
        this.reaction({
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            message: {
                format: '{player} plays {source} to draw {amount}',
                args: { amount: (context) => TextHelper.count(schemeCards(context), 'card') }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: schemeCards(context)
            }))
        });
    }
}

function schemeCards(context) {
    return context.event.challenge.loser.getHandCount() === 0 ? 4 : 2;
}

InsidiousScheme.code = '05023';

export default InsidiousScheme;
