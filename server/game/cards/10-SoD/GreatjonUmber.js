const DrawCard = require('../../drawcard.js');

class GreatjonUmber extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    this.controller.getNumberOfUsedPlots() < 3 &&
                    this.kneeled
            },
            handler: (context) => {
                context.player.standCard(this);
                this.game.addMessage('{0} stands {1}', context.player, this);
            }
        });
    }
}

GreatjonUmber.code = '10033';

module.exports = GreatjonUmber;
