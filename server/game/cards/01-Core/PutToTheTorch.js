const DrawCard = require('../../drawcard.js');

class PutToTheTorch extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getType() === 'location',
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to discard {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

PutToTheTorch.code = '01042';

module.exports = PutToTheTorch;
