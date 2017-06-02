const DrawCard = require('../../../drawcard.js');

class ShierakQiya extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'power' &&
                    challenge.winner === this.controller &&
                    challenge.strengthDifference >= 5
                )
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select a participating character to stand',
                cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isParticipating(card),
                gameAction: 'stand'
            },
            handler: (context) => {
                this.controller.standCard(context.target);
                this.game.addMessage('{0} uses {1} to stand {2}', context.player, this, context.target);
            }
        });
    }
}

ShierakQiya.code = '04015';

module.exports = ShierakQiya;
