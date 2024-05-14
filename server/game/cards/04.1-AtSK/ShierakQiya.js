const DrawCard = require('../../drawcard.js');

class ShierakQiya extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating(),
                gameAction: 'stand'
            },
            handler: (context) => {
                this.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

ShierakQiya.code = '04015';

module.exports = ShierakQiya;
