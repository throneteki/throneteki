import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AllTheGoldInCasterlyRock extends DrawCard {
    // All the Gold in Casterly Rock (26106)
    // Limited. Shadow (0).
    // Reaction: After you win an [intrigue] challenge, gain 2 gold for each card you control in
    // shadows.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: {
                format: '{player} plays {source} to gain {amount} gold',
                args: { amount: (context) => context.source.getAmount(context) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.source.getAmount(context)
            }))
        });
    }

    getAmount(context) {
        return context.player.shadows.length * 2;
    }
}

AllTheGoldInCasterlyRock.code = '26106';

export default AllTheGoldInCasterlyRock;
