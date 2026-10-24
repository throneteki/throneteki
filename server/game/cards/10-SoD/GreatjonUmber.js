import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatjonUmber extends DrawCard {
    // Greatjon Umber (10033)
    // Intimidate.
    // Reaction: After you win a [military] challenge in which Greatjon Umber is attacking, if there
    // are fewer than 3 plot cards in your used pile, stand him.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === context.player &&
                    context.source.isAttacking() &&
                    context.player.getNumberOfUsedPlots() < 3
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

GreatjonUmber.code = '10033';

export default GreatjonUmber;
