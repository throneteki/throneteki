import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreatjonUmber extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    this.controller.getNumberOfUsedPlots() < 3
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

GreatjonUmber.code = '10033';

export default GreatjonUmber;
