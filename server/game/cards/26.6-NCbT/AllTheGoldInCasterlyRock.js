import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AllTheGoldInCasterlyRock extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: {
                format: '{player} plays {source} to gain {amount} gold',
                args: { amount: (context) => this.getAmount(context) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: this.getAmount(context)
            }))
        });
    }

    getAmount(context) {
        return context.player.shadows.length * 2;
    }
}

AllTheGoldInCasterlyRock.code = '26106';

export default AllTheGoldInCasterlyRock;
