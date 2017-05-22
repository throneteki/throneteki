const DrawCard = require('../../../drawcard.js');

class PutToTheSword extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'military' &&
                    challenge.winner === this.controller &&
                    challenge.attackingPlayer === this.controller &&
                    challenge.strengthDifference >= 5
                )
            },
            target: {
                activePromptTitle: 'Select a character to kill',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character',
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage('{0} uses {1} to kill {2}', context.player, this, context.target);
            }
        });
    }
}

PutToTheSword.code = '01041';

module.exports = PutToTheSword;
