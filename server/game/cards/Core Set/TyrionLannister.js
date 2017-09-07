const DrawCard = require('../../../drawcard.js');

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.challengeType === 'intrigue' && !this.controller.cannotGainGold
            },
            limit: ability.limit.perRound(2),
            handler: () => {
                this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain 2 gold', this.controller, this);
            }
        });
    }
}

TyrionLannister.code = '01089';

module.exports = TyrionLannister;
